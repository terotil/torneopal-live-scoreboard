/* Local scoreboard controller with console-based UI
   - Single-key controls
   - Reads initial state from taso/rest/getScore.json
   - Writes back after every change (including each tick)
*/
const fs = require('fs/promises');
const path = require('path');

const SCORE_FILE = path.resolve(__dirname, 'taso/rest/getScore.json');

let scoreFileState;
let seconds = 0;
let liveTimerId = null;
let liveTimerStartTime = null;
let liveTimerBaseSeconds = 0;

function parseMMSS(mmss) {
  const m = /^(\d{1,2}):([0-5]\d)$/.exec((mmss || '').trim());
  if (!m) return 0;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}

function formatMMSS(total) {
  const s = Math.max(0, total | 0);
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

async function load() {
  const raw = await fs.readFile(SCORE_FILE, 'utf8');
  scoreFileState = JSON.parse(raw);
  ensureScoreShape();
  seconds = parseMMSS(scoreFileState.score.live_time_mmss);
}

function ensureScoreShape() {
  scoreFileState = scoreFileState || {};
  scoreFileState.score = scoreFileState.score || {};
  const s = scoreFileState.score;
  // Ensure required fields exist with sane defaults (keep string types like source)
  if (typeof s.live_period === 'undefined') s.live_period = '1';
  if (typeof s.live_time_mmss === 'undefined') s.live_time_mmss = '00:00';
  if (typeof s.live_timer_on === 'undefined') s.live_timer_on = '0';
  if (typeof s.live_A === 'undefined') s.live_A = '0';
  if (typeof s.live_B === 'undefined') s.live_B = '0';
}

let saveTimeoutId = null;
function scheduleSave() {
  if (saveTimeoutId) return;
  saveTimeoutId = setTimeout(async () => {
    try {
      await fs.writeFile(SCORE_FILE, JSON.stringify(scoreFileState, null, 2) + '\n', 'utf8');
    } catch (e) {
      // Show error but keep running
      process.stderr.write(`\nTallennus epäonnistui: ${e.message}\n`);
    } finally {
      // Always clear the save timer
      saveTimeoutId = null;
    }
  }, 0);
}

function setTimerRunning(running) {
  const shouldRun = !!running;
  const isRunning = !!liveTimerId;
  if (shouldRun === isRunning) return;

  scoreFileState.score.live_timer_on = shouldRun ? '1' : '0';
  if (shouldRun) {
    // Start timer: store current time as base and reset base seconds
    liveTimerBaseSeconds = seconds;
    liveTimerStartTime = Date.now();
    
    liveTimerId = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - liveTimerStartTime) / 1000);
      const newSeconds = liveTimerBaseSeconds + elapsedSeconds;
      
      // Only update and save if seconds actually changed
      if (newSeconds !== seconds) {
        seconds = newSeconds;
        scoreFileState.score.live_time_mmss = formatMMSS(seconds);
        render();
        scheduleSave();
      }
    }, 100); // Check more frequently for smoother updates
  } else {
    clearInterval(liveTimerId);
    liveTimerId = null;
  }
  render();
  scheduleSave();
}

function setScore(key, delta) {
  const val = Math.max(0, parseInt(scoreFileState.score[key] || '0', 10) + delta);
  scoreFileState.score[key] = String(val);
  render();
  scheduleSave();
}

function reloadFromDisk() {
  load()
    .then(() => {
      setTimerRunning(scoreFileState.score.live_timer_on === '1');
      render();
    })
    .catch((e) => {
      process.stderr.write(`\nLataus epäonnistui: ${e.message}\n`);
    });
}

function exitClean(code = 0) {
  if (liveTimerId) clearInterval(liveTimerId);
  if (saveTimeoutId) {
    clearTimeout(saveTimeoutId);
    saveTimeoutId = null;
  }
  // Ensure final state has current time
  scoreFileState.score.live_time_mmss = formatMMSS(seconds);
  const out = JSON.stringify(scoreFileState, null, 2) + '\n';
  fs.writeFile(SCORE_FILE, out, 'utf8')
    .catch(() => {})
    .finally(() => {
      // Show cursor back and exit
      process.stdout.write('\x1B[?25h');
      process.stdout.write('\n');
      process.exit(code);
    });
}

function render() {
  const s = scoreFileState.score;
  const teamA = s.team_A_name || 'Joukkue A';
  const teamB = s.team_B_name || 'Joukkue B';
  const period = s.live_period || '1';
  const time = s.live_time_mmss || '00:00';
  const scoreA = s.live_A ?? '0';
  const scoreB = s.live_B ?? '0';
  const running = s.live_timer_on === '1';

  // Clear and draw
  console.clear();
  process.stdout.write(
    [
      'Torneopal Live - Konsoliohjaus',
      '==============================',
      `Erä (e+/w-): ${period}    Aika (space): ${time} ${running ? '(käynnissä)' : '(pysäytetty)'}`,
      '',
      `${teamA} (a+/z-)  ${scoreA}  -  ${scoreB}  ${teamB} (s+/x-)`,
      '',
      'Muut näppäimet:',
      '  r        Lataa tiedosto uudelleen',
      '  q        Lopeta',
      '',
    ].join('\n')
  );
}

async function main() {
  await load();
  // Initialize runner from file
  setTimerRunning(scoreFileState.score.live_timer_on === '1');
  // Hide cursor
  process.stdout.write('\x1B[?25l');
  render();

  // Input
  const stdin = process.stdin;
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding('utf8');

  stdin.on('data', (key) => {
    // Handle CTRL+C
    if (key === '\u0003') return exitClean(0);

    switch (key) {
      case ' ':
        setTimerRunning(!(scoreFileState.score.live_timer_on === '1'));
        break;
      case 'a':
        setScore('live_A', +1);
        break;
      case 'z':
        setScore('live_A', -1);
        break;
      case 's':
        setScore('live_B', +1);
        break;
      case 'x':
        setScore('live_B', -1);
        break;
      case 'e':
        setScore('live_period', +1);
        break;
      case 'w':
        setScore('live_period', -1);
        break;
      case 'r':
        reloadFromDisk();
        break;
      case 'q':
        exitClean(0);
        break;
      default:
        // ignore
        break;
    }
  });

  // Save current snapshot on SIGINT/SIGTERM
  process.on('SIGINT', () => exitClean(0));
  process.on('SIGTERM', () => exitClean(0));
}

main().catch((e) => {
  process.stderr.write(`Virhe käynnistyksessä: ${e.message}\n`);
  process.exit(1);
});
