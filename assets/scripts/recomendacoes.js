const horas = {
    sono: 0,
    trabalho: 0,
    lazer: 0,
}

fetch("/metricas/usuario", {
    headers: {
        "Authentication": "Bearer " + localStorage.getItem("token")
    }
})
.then((res) => res.json())
.then(json => json[0])
.then(dados => {
    horas.sono = dados.horas_sono
    horas.lazer = dados.horas_lazer
    horas.trabalho = dados.horas_trabalho
    console.log(horas)
})