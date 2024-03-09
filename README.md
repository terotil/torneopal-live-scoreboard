# Torneopal tulosgrafiikka

Suoran lähetyksen tulosgrafiikka, joka päivittyy automaattisesti Torneopalin Taso API:n tulostietojen perusteella.

Toistaiseksi varsinaiseen käyttötarkoitukseensa soveltumaton raakaversio!

## Käyttö

Tarvitset Torneopal Taso API:n avaimen, jonka saat turnausjärjestäjältä.

Avaa `index.html` suoraan selaimessa tai käynnistä paikallinen web-palvelin ja seuraa ohjeita

    npm install
    npm start

Voit syöttää avaimen tekstikenttään tai jos avasit sivun web-palvelimen kautta, voit syöttää avaimen myös URL-parametreissa

    http://<paikallinen palvelimesi>/?api_key=<avain>

Tehtyäsi otteluvalinnan, (toistaiseksi käyttökelvottoman ruma) tulostaulu ilmestyy näkyviin. Nyt voit kopioida osoitteen selaimen osoiteriviltä ja syöttää sen OBS:n "Browser Source" asetuksiin URL-kenttään.

## Jatkokehitys

- Alusta otteluvalitsimen tila URL-parametreista
- Päivitä otteluvalitsimen tilaa URL-parametreihin
- Erätauon näyttö
- Pelikello
- Jäähykello
