const form = document.querySelector('#form')
const resultado = document.querySelector('#resultado')
const h2 = document.querySelector('#resultado h2')

document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault()
    calcular()
})

function calcular() {
    const valorFinanciamento = form.emprestimo.value
        .replace('.', '')   // Valor do Financiamento 
    const taxa = form.taxa.value
        .replace('.', '') / 100 // Taxa de Juros ( ao mês)
    const qtyParcelas = form.qtyParcelas.value
        .replace('.', '') // Número de Parcelas(Período)
    let table = form.sel.value // regra de juros tabela price || sac
    let amortização = 0         // Amortização =>   a =  valorFinanciamento / qtyParcelas ;  
    let parcelasPG = 0          // Número de Parcelas Pagas 
    let totalJuros = 0          // Total de juros pagos do financiamento
    let totalPago = 0           // Total pago no financiamento acrescido os juros
    let valueParacelas = 0

    const span = document.createElement('span')
    const div = document.createElement('div')
    div.setAttribute("style", "margin: 0 0 .5em .5em; line-height: 1.5em;")
    const h2 = document.createElement('h2')

    resultado.innerHTML = ''
    if (valorFinanciamento && taxa && qtyParcelas) {
        if (table === 'price') {
            for (let index = 0; index < qtyParcelas; index++) {
                value = valorFinanciamento * (Math.pow((1 + taxa), qtyParcelas) * taxa) / (Math.pow((1 + taxa), qtyParcelas) - 1)
                valueParacelas = value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
                totalPago += value
            }
            div.innerHTML = `<p><span>${qtyParcelas}</span> parcelas de <span>${valueParacelas}</span></p>`

        } else if (table === 'sac') {
            div.classList.add('sac')
            const divParcela = resultado.appendChild(div)
            for (let index = 0; index < qtyParcelas; index++) {
                amortização = valorFinanciamento / qtyParcelas
                parcelasPG = index
                const value = amortização + taxa * (valorFinanciamento - (parcelasPG * amortização))
                totalPago += value
                valueParacelas = value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })

                const p = document.createElement('p')
                p.innerHTML = `${index + 1}&#186; parcela ${valueParacelas}`
                divParcela.appendChild(p)
            }
        }
        h2.innerHTML = 'Resultado:'
        resultado.append(h2)
        resultado.append(div)
        const div2 = document.createElement('div')
        resultado.append(div2)
        div2.setAttribute("style", "font-size: .8em;")
        div2.innerHTML += `<p><span class='bold'>Total pago:</span> 
        <span class='red'>${totalPago.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span>
        </p>`
        totalJuros = totalPago - valorFinanciamento
        div2.innerHTML += `<p><span class='bold'>Juros:</span>
        <span class='red'>${totalJuros.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span>
         </p>`
    } else {
        div.classList.add('alerta')
        div.innerHTML = 'Revise as informações passadas !'
        resultado.append(div)
    }
}