# Torneopal tulosgrafiikka

Suoran lähetyksen tulosgrafiikka, joka päivittyy automaattisesti Torneopalin Taso API:n tulostietojen perusteella.

Toistaiseksi varsinaiseen käyttötarkoitukseensa soveltumaton raakaversio!

## Käyttö

Tarvitset Torneopal Taso API:n avaimen, jonka saat turnausjärjestäjältä.

### Julkaistu testiversio

Testiversio on käytettävissä osoitteessa https://lucky-mermaid-099be2.netlify.app/

### Paikallisella tiedostolla

Voit testata tulostaulua paikallisesti pelkällä html-tiedostolla. Lataa `index.html` ja avaa se suoraan selaimessa. Tämä vaihtoehto ei mahdollista avaamista suoraan tulosgrafiikkanäkymään URL-parametrien avulla.

### Paikallisella palvelimella

Tätä varten tarvitaan [Node.js](https://nodejs.org/). Lataa (tai kloonaa) repositorio, käynnistä paikallinen web-palvelin ja avaa tulosgrafiikkasivu konsoliin tulostuneesta osoitteesta

    npm install
    npm start

Voit syöttää avaimen tekstikenttään tai jos avasit sivun web-palvelimen kautta, voit syöttää avaimen myös URL-parametreissa

    http://<paikallinen palvelimesi>/index.html?api_key=<avain>

Tehtyäsi otteluvalinnan, tulostaulu ilmestyy näkyviin. Nyt voit kopioida osoitteen selaimen osoiteriviltä ja syöttää sen OBS:n "Browser Source" asetuksiin URL-kenttään.

## Jatkokehitys

Laita [tikettiä](https://github.com/terotil/torneopal-live-scoreboard/issues) jos sinulla on idea, ongelma, vikahavainto tai kysymys. Parannuksia voi laittaa myös suoraan pull requestina.

Katso lisätietoja [kehittäjäohjeista](CONTRIBUTING.md).

Jatkokehityssuunnitelmissa

- Ottelutunnisteen syöttö kenttään (otteluvalitsimen käytön sijaan)
- Pelikello
- Tulosgrafiikan visuaalisen ilmeen mukauttaminen
- Testiaineisto ja testiaineiston ajo
- Alusta otteluvalitsimen tila URL-parametreista
- Päivitä otteluvalitsimen tilaa URL-parametreihin
- Erätauon näyttö
- Jäähykello
