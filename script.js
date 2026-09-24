// -------------------------
// GEGEVENS
// -------------------------

let vakken = JSON.parse(localStorage.getItem("vakken")) || [];

let rooster = JSON.parse(localStorage.getItem("rooster")) || {
    maandag: [],
    dinsdag: [],
    woensdag: [],
    donderdag: [],
    vrijdag: []
};

let vasteSpullen =
    JSON.parse(localStorage.getItem("vasteSpullen")) || [];

let bewerkIndex = null;


// -------------------------
// STARTPAGINA
// -------------------------

function toonStartPagina() {

    document.getElementById("vakkenPagina")
        .classList.add("verborgen");

    document.getElementById("roosterPagina")
        .classList.add("verborgen");

    document.getElementById("altijdMeenemenPagina")
        .classList.add("verborgen");

    document.getElementById("startPagina")
        .classList.remove("verborgen");

    toonInpaklijst();
}


// -------------------------
// VAKKENPAGINA
// -------------------------

function toonVakken() {

    document.getElementById("startPagina")
        .classList.add("verborgen");

    document.getElementById("roosterPagina")
        .classList.add("verborgen");

    document.getElementById("altijdMeenemenPagina")
        .classList.add("verborgen");

    document.getElementById("vakkenPagina")
        .classList.remove("verborgen");

    toonVakkenLijst();
}


// -------------------------
// ROOSTERPAGINA
// -------------------------

function openRooster() {

    document.getElementById("startPagina")
        .classList.add("verborgen");

    document.getElementById("vakkenPagina")
        .classList.add("verborgen");

    document.getElementById("altijdMeenemenPagina")
        .classList.add("verborgen");

    document.getElementById("roosterPagina")
        .classList.remove("verborgen");

    toonRooster();
}


// -------------------------
// ALTIJD MEENEMEN PAGINA
// -------------------------

function openAltijdMeenemen() {

    document.getElementById("startPagina")
        .classList.add("verborgen");

    document.getElementById("vakkenPagina")
        .classList.add("verborgen");

    document.getElementById("roosterPagina")
        .classList.add("verborgen");

    document.getElementById("altijdMeenemenPagina")
        .classList.remove("verborgen");

    toonVasteSpullen();
}


// -------------------------
// VAK TOEVOEGEN
// -------------------------

function toonVakToevoegen() {

    bewerkIndex = null;

    document.getElementById("formulierTitel").textContent =
        "➕ Nieuw vak";

    document.getElementById("vakNaam").value = "";
    document.getElementById("materiaal").value = "";

    document.getElementById("nieuwVak")
        .classList.remove("verborgen");
}


// -------------------------
// FORMULIER SLUITEN
// -------------------------

function verbergVakToevoegen() {

    document.getElementById("nieuwVak")
        .classList.add("verborgen");

    document.getElementById("vakNaam").value = "";
    document.getElementById("materiaal").value = "";

    bewerkIndex = null;
}


// -------------------------
// VAK OPSLAAN
// -------------------------

function vakOpslaan() {

    const naam =
        document.getElementById("vakNaam").value.trim();

    const materiaalTekst =
        document.getElementById("materiaal").value.trim();


    if (naam === "" || materiaalTekst === "") {

        alert("Vul zowel het vak als de benodigdheden in.");

        return;
    }


    const materialen = materiaalTekst
        .split(",")
        .map(item => item.trim())
        .filter(item => item !== "");


    const vak = {
        naam: naam,
        materialen: materialen
    };


    if (bewerkIndex !== null) {

        const oudeNaam = vakken[bewerkIndex].naam;

        vakken[bewerkIndex] = vak;


        const dagen = [
            "maandag",
            "dinsdag",
            "woensdag",
            "donderdag",
            "vrijdag"
        ];


        dagen.forEach(dag => {

            if (rooster[dag]) {

                rooster[dag] = rooster[dag].map(
                    vakNaam =>
                        vakNaam === oudeNaam
                            ? naam
                            : vakNaam
                );

            }

        });


        localStorage.setItem(
            "rooster",
            JSON.stringify(rooster)
        );

    } else {

        vakken.push(vak);

    }


    localStorage.setItem(
        "vakken",
        JSON.stringify(vakken)
    );


    verbergVakToevoegen();

    toonVakkenLijst();
}


// -------------------------
// VAKKEN TONEN
// -------------------------

function toonVakkenLijst() {

    const lijst =
        document.getElementById("vakkenLijst");

    lijst.innerHTML = "";


    if (vakken.length === 0) {

        lijst.innerHTML =
            "<p>Je hebt nog geen vakken toegevoegd.</p>";

        return;
    }


    vakken.forEach((vak, index) => {

        const kaart =
            document.createElement("div");

        kaart.className = "vakKaart";


        const titel =
            document.createElement("h3");

        titel.textContent =
            "📚 " + vak.naam;


        const materialenLijst =
            document.createElement("ul");


        vak.materialen.forEach(materiaal => {

            const item =
                document.createElement("li");

            item.textContent = materiaal;

            materialenLijst.appendChild(item);

        });


        const knoppen =
            document.createElement("div");

        knoppen.className = "vakKnoppen";


        const bewerkKnop =
            document.createElement("button");

        bewerkKnop.textContent =
            "Bewerken";

        bewerkKnop.className =
            "bewerkKnop";

        bewerkKnop.onclick = function () {
            bewerkVak(index);
        };


        const verwijderKnop =
            document.createElement("button");

        verwijderKnop.textContent =
            "Verwijderen";

        verwijderKnop.className =
            "verwijderKnop";

        verwijderKnop.onclick = function () {
            verwijderVak(index);
        };


        knoppen.appendChild(bewerkKnop);
        knoppen.appendChild(verwijderKnop);

        kaart.appendChild(titel);
        kaart.appendChild(materialenLijst);
        kaart.appendChild(knoppen);

        lijst.appendChild(kaart);

    });
}


// -------------------------
// VAK BEWERKEN
// -------------------------

function bewerkVak(index) {

    const vak = vakken[index];

    bewerkIndex = index;


    document.getElementById("formulierTitel").textContent =
        "✏️ Vak bewerken";


    document.getElementById("vakNaam").value =
        vak.naam;


    document.getElementById("materiaal").value =
        vak.materialen.join(", ");


    document.getElementById("nieuwVak")
        .classList.remove("verborgen");
}


// -------------------------
// VAK VERWIJDEREN
// -------------------------

function verwijderVak(index) {

    const vak = vakken[index];


    const bevestiging = confirm(
        'Weet je zeker dat je "' +
        vak.naam +
        '" wilt verwijderen?'
    );


    if (!bevestiging) {
        return;
    }


    vakken.splice(index, 1);


    const dagen = [
        "maandag",
        "dinsdag",
        "woensdag",
        "donderdag",
        "vrijdag"
    ];


    dagen.forEach(dag => {

        rooster[dag] =
            rooster[dag].filter(
                vakNaam => vakNaam !== vak.naam
            );

    });


    localStorage.setItem(
        "vakken",
        JSON.stringify(vakken)
    );

    localStorage.setItem(
        "rooster",
        JSON.stringify(rooster)
    );


    toonVakkenLijst();
}


// -------------------------
// ROOSTER TONEN
// -------------------------

function toonRooster() {

    const lijst =
        document.getElementById("roosterLijst");

    lijst.innerHTML = "";


    const dagen = [
        "maandag",
        "dinsdag",
        "woensdag",
        "donderdag",
        "vrijdag"
    ];


    if (vakken.length === 0) {

        lijst.innerHTML =
            "<p>Voeg eerst je vakken toe bij 'Vakken beheren'.</p>";

        return;
    }


    dagen.forEach(dag => {

        const dagKaart =
            document.createElement("div");

        dagKaart.className =
            "dagKaart";


        const titel =
            document.createElement("h3");

        titel.textContent =
            dag.charAt(0).toUpperCase() +
            dag.slice(1);


        dagKaart.appendChild(titel);


        vakken.forEach((vak, index) => {

            const keuze =
                document.createElement("div");

            keuze.className =
                "vakKeuze";


            const checkbox =
                document.createElement("input");

            checkbox.type = "checkbox";

            checkbox.id =
                dag + "-" + index;

            checkbox.value =
                vak.naam;


            if (
                rooster[dag] &&
                rooster[dag].includes(vak.naam)
            ) {

                checkbox.checked = true;

            }


            const label =
                document.createElement("label");

            label.htmlFor =
                checkbox.id;

            label.textContent =
                vak.naam;


            keuze.appendChild(checkbox);
            keuze.appendChild(label);

            dagKaart.appendChild(keuze);

        });


        lijst.appendChild(dagKaart);

    });
}


// -------------------------
// ROOSTER OPSLAAN
// -------------------------

function roosterOpslaan() {

    const dagen = [
        "maandag",
        "dinsdag",
        "woensdag",
        "donderdag",
        "vrijdag"
    ];


    dagen.forEach(dag => {

        const gekozenVakken = [];


        vakken.forEach((vak, index) => {

            const checkbox =
                document.getElementById(
                    dag + "-" + index
                );


            if (
                checkbox &&
                checkbox.checked
            ) {

                gekozenVakken.push(vak.naam);

            }

        });


        rooster[dag] =
            gekozenVakken;

    });


    localStorage.setItem(
        "rooster",
        JSON.stringify(rooster)
    );


    alert("Je rooster is opgeslagen! ✅");

    toonRooster();
}


// -------------------------
// ALTIJD MEENEMEN
// -------------------------

function vastSpulToevoegen() {

    const invoer =
        document.getElementById("nieuwVastSpul");

    const spul =
        invoer.value.trim();


    if (spul === "") {

        alert("Vul eerst een spul in.");

        return;
    }


    if (vasteSpullen.includes(spul)) {

        alert("Dit spul staat al in je lijst.");

        return;
    }


    vasteSpullen.push(spul);


    localStorage.setItem(
        "vasteSpullen",
        JSON.stringify(vasteSpullen)
    );


    invoer.value = "";

    toonVasteSpullen();
}


function toonVasteSpullen() {

    const lijst =
        document.getElementById("vasteSpullenLijst");

    lijst.innerHTML = "";


    if (vasteSpullen.length === 0) {

        lijst.innerHTML =
            "<p>Je hebt nog geen vaste spullen toegevoegd.</p>";

        return;
    }


    vasteSpullen.forEach((spul, index) => {

        const kaart =
            document.createElement("div");

        kaart.className =
            "vastSpulKaart";


        const naam =
            document.createElement("span");

        naam.className =
            "vastSpulNaam";

        naam.textContent =
            "🎒 " + spul;


        const verwijderKnop =
            document.createElement("button");

        verwijderKnop.textContent =
            "Verwijderen";

        verwijderKnop.onclick =
            function () {
                verwijderVastSpul(index);
            };


        kaart.appendChild(naam);
        kaart.appendChild(verwijderKnop);

        lijst.appendChild(kaart);

    });
}


function verwijderVastSpul(index) {

    vasteSpullen.splice(index, 1);


    localStorage.setItem(
        "vasteSpullen",
        JSON.stringify(vasteSpullen)
    );


    toonVasteSpullen();
}


// -------------------------
// VOLGENDE SCHOOLDAG
// -------------------------

function krijgVolgendeSchooldag() {

    const vandaag = new Date();

    const dag = vandaag.getDay();

    const uur = vandaag.getHours();

    const minuten = vandaag.getMinutes();


    // Jouw ingestelde tijd: 09:20
    const voorNegenTwintig =
        uur < 9 || (uur === 9 && minuten < 20);


    // Zondag → maandag
    if (dag === 0) {
        return "maandag";
    }


    // Zaterdag → maandag
    if (dag === 6) {
        return "maandag";
    }


    // Maandag
    if (dag === 1) {

        if (voorNegenTwintig) {
            return "maandag";
        }

        return "dinsdag";
    }


    // Dinsdag
    if (dag === 2) {

        if (voorNegenTwintig) {
            return "dinsdag";
        }

        return "woensdag";
    }


    // Woensdag
    if (dag === 3) {

        if (voorNegenTwintig) {
            return "woensdag";
        }

        return "donderdag";
    }


    // Donderdag
    if (dag === 4) {

        if (voorNegenTwintig) {
            return "donderdag";
        }

        return "vrijdag";
    }


    // Vrijdag
    if (dag === 5) {

        if (voorNegenTwintig) {
            return "vrijdag";
        }

        return "maandag";
    }
}


// -------------------------
// INPAKLIJST
// -------------------------

function toonInpaklijst() {

    const lijst =
        document.getElementById("inpaklijst");

    const dagTekst =
        document.getElementById("volgendeDagTekst");


    lijst.innerHTML = "";


    const volgendeDag =
        krijgVolgendeSchooldag();


    dagTekst.textContent =
        "Dit heb je nodig voor " +
        volgendeDag + ":";


    const vakkenVoorDag =
        rooster[volgendeDag] || [];


    let aantalSpullen = 0;


    // VAKKEN
    vakkenVoorDag.forEach(vakNaam => {

        const vak =
            vakken.find(
                item => item.naam === vakNaam
            );


        if (!vak) {
            return;
        }


        const vakKaart =
            document.createElement("div");

        vakKaart.className =
            "inpakVak";


        const titel =
            document.createElement("h3");

        titel.textContent =
            "📚 " + vak.naam;


        const materialen =
            document.createElement("ul");


        vak.materialen.forEach(materiaal => {

            const item =
                document.createElement("li");

            item.textContent =
                materiaal;

            materialen.appendChild(item);

            aantalSpullen++;

        });


        vakKaart.appendChild(titel);
        vakKaart.appendChild(materialen);

        lijst.appendChild(vakKaart);

    });


    // ALTIJD MEENEMEN
    if (vasteSpullen.length > 0) {

        const vasteKaart =
            document.createElement("div");

        vasteKaart.className =
            "vasteSpullen";


        const titel =
            document.createElement("h3");

        titel.textContent =
            "🎒 Altijd meenemen";


        const lijstVast =
            document.createElement("ul");


        vasteSpullen.forEach(spul => {

            const item =
                document.createElement("li");

            item.textContent =
                spul;

            lijstVast.appendChild(item);

        });


        vasteKaart.appendChild(titel);
        vasteKaart.appendChild(lijstVast);

        lijst.appendChild(vasteKaart);

    }


    // ALS ER HELEMAAL NIETS IS
    if (
        vakkenVoorDag.length === 0 &&
        vasteSpullen.length === 0
    ) {

        lijst.innerHTML =
            '<div class="geenSpullen">' +
            "Er zijn nog geen spullen ingesteld voor " +
            volgendeDag +
            "." +
            "</div>";

    }
}


// -------------------------
// INPAKLIJST LADEN
// -------------------------

toonInpaklijst();
