// obtém os elementos da página
const frm = document.querySelector("form");
const dvPalco = document.querySelector("#divPalco");
// constante que define o número de poltronas
const POLTRONAS = 240;
// vetor com as poltronas reservadas pelo usuário
const reservadas = [];

// define o valor máximo para a entrada de número da poltrona
document.getElementById("inPoltrona").max = POLTRONAS;


window.addEventListener("load", () => {
    // se houver dados salvos em localStorage, faz um split(";") e atribui esses dados ao array, caso contrario, inicializamos o array
    const ocupadas = localStorage.getItem("teatroOcupadas")
    ? localStorage.getItem("teatroOcupadas").split(";")
    : [];

    // monta o númeor total de poltronas definidas pela constante
    for (let i = 1; i <= POLTRONAS; i++) {
        // cria a tag figure
        const figure = document.createElement("figure");
        // cria a tag img
        const imgStatus = document.createElement("img");

        // se a poltrona estiver ocupada, exibe a imagem "ocupado.jpg"
        // se não, exibe a imagem "disponivel.jpg"
        imgStatus.src = ocupadas.includes(i.toString())
        ? "img/ocupada.jpg"
        : "img/disponivel.jpg";
        // classe com a dimensão da imagem
        imgStatus.className = "poltrona";

        // cria a figcaption
        const figureCap = document.createElement("figcaption");

        const zeros = i < 10 ? "00" : i < 100 ? "0" : "";

        // cria o texto
        const num = document.createTextNode(`[${zeros}${i}]`)

        // define os pais de cada tag criada
        figureCap.appendChild(num);
        figure.appendChild(imgStatus);
        figure.appendChild(figureCap);

        // se i módulo de 24 == 12 (é o corredor: define margem direita 60px)
        if (i % 24 == 12) figure.style.marginRight = "60px"

        // indica que a figura é filha de divPalco
        dvPalco.appendChild(figure);

        // se i módulo 24 == 0: o código após o && será executado (inserindo quebra de linha)
        (i % 24 == 0) && dvPalco.appendChild(document.createElement("br"));
    }
})

frm.addEventListener("submit", (e) => {
    e.preventDefault();

    // obtém o conteúdo de input e transforma-o em número
    const poltrona = Number(frm.inPoltrona.value);

    const ocupadas = localStorage.getItem("teatroOcupadas")
    ? localStorage.getItem("teatroOcupadas").split(";")
    : [];

    // verifica se a poltrona selecionda já está reservada
    if (reservadas.includes(poltrona)) {
        alert(`A poltrona ${poltrona} já está reservada.`);
        frm.inPoltrona.value = "";
        frm.inPoltrona.focus();
        return;
    }

    // verifica se a poltrona selecionda já está ocupada
    if (ocupadas.includes(poltrona.toString())) {
        alert(`A poltrona ${poltrona} já está ocupada.`);
        frm.inPoltrona.value = "";
        frm.inPoltrona.focus();
        return;
    }

    // capturar a imagem da poltrona filha de divPalco
    const imgPoltrona = dvPalco.querySelectorAll("img")[poltrona-1];

    // modifica a imagem da poltrona para a reservada
    imgPoltrona.src = "img/reservada.jpg";

    // adiciona a poltrona ao vetor
    reservadas.push(poltrona);

    frm.inPoltrona.value = "";
    frm.inPoltrona.focus();
})

frm.btConfirmar.addEventListener("click", () => {
    // verifica a presença de poltronas reservadas
    if (reservadas.length == 0) {
        alert("Não há poltronas reservadas a confirmar.");
        frm.inPoltrona.focus();
        return;
    }

    const ocupadas = localStorage.getItem("teatroOcupadas")
    ? localStorage.getItem("teatroOcupadas").split(";")
    : [];

    // for decrescente, pois as reservas vão sendo removidas a cada alteração da imagem
    for (let i = reservadas.length - 1; i >= 0; i--) {
        ocupadas.push(reservadas[i]);

        // captura a imagem da poltrona, filha e divPalco
        const imgPoltrona = dvPalco.querySelectorAll("img")[reservadas[i]-1];
        imgPoltrona.src = "img/ocupada.jpg"
        //remove do vetor e reserva a já alterada
        reservadas.pop();
    }

    localStorage.setItem("teatroOcupadas", ocupadas.join(";"))
})

frm.btCancelar.addEventListener("click", () => {
    // armazena o número de netrada
    const poltrona = Number(frm.inPoltrona.value);
    // gera a variável do vetor de poltronas ocupadas
    const ocupadas = localStorage.getItem("teatroOcupadas")
    ? localStorage.getItem("teatroOcupadas").split(";")
    : [];

    // verifica a presença de poltronas ocupadas
    if (ocupadas.length == 0) {
        alert("Não há poltronas confirmadas a cancelar.");
        frm.inPoltrona.focus();
        return;
    }

    // verifica se a poltrona inserida já está ocupada
    if (!ocupadas.includes(poltrona.toString())) {
        alert(`A poltrona ${poltrona} ainda não foi confirmada para poder ser cancelada.`);
        frm.inPoltrona.value = "";
        frm.inPoltrona.focus();
        return;
    }

    // captura a imagem da poltrona filha de divPalco
    const imgPoltrona = dvPalco.querySelectorAll("img")[poltrona-1];

    // modifica a imagem da poltrona para a disponível
    imgPoltrona.src = "img/disponivel.jpg";

    // remove a poltrona do vetor
    console.log(ocupadas);
    var index = ocupadas.indexOf(String(poltrona));
    if (index !== (-1)) {
        ocupadas.splice(index, 1);
    }

    localStorage.setItem("teatroOcupadas", ocupadas.join(";"))

    frm.inPoltrona.value = "";
    frm.inPoltrona.focus();
    
})
