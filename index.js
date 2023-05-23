const form = document.querySelector('#form')
const resultado = document.querySelector('#resultado')
const resumo = document.querySelector('#resumo')
const h2 = document.querySelector('#resultado h2')
const none = document.querySelector('.none')
const div = document.createElement('div')
let textAlert = ''
const submit = document.querySelector('input[type="submit"]')

form.addEventListener('submit', (event) => {
    event.preventDefault()
    calcular()
})

function alert(text) {
    div.classList.add('alerta')
    div.innerHTML = text
    return resumo.append(div)
}

function calcular() {
    resultado.innerHTML = ''
    resumo.innerHTML = ''
    if (form.financiamento.value && form.taxa.value && form.qtyParcelas.value) {
        let inpFinanciamento = form.financiamento.value
        let inpTaxa = form.taxa.value
        const f = inpFinanciamento.match(/\,/g) || []
        const t = inpTaxa.match(/\,/g) || []

        if (f.length > 2 ||
            t.length > 2) {
            textAlert = "Você usou pontos ou virgulas de forma inadequada !"
            return alert(textAlert)
        }
        const valorFinanciamento = parseFloat(inpFinanciamento
            .replace(/\./g, '')
            .replace(/\,/g, '.')
        )
        const taxa = parseFloat(inpTaxa
            .replace(/\,/g, '.')) / 100

        const qtyParcelas = form.qtyParcelas.value  // Número de Parcelas(Período)
        let table = form.sel.value  // regra de juros tabela price || sac
        let valueAmortizacao = 0    // Amortização=> a = valorFinanciamento/qtyParcelas ;  
        let parcelasPG = 0          // Número de Parcelas Pagas 
        let totalJuros = 0          // Total de juros pagos do financiamento
        let totalPago = 0           // Total pago com juros
        let valueParacelas = 0      // Valor das poarcelas
        let value = 0               // Aux para calcular valueParcelas
        let saldoAtual = 0          // Financiamento restante sem juros
        let jurosAtual = 0          // Valor do montante de juros pago no mês

        div.classList.add('sac')
        const divParcela = resultado.appendChild(div)

        if (table === 'price') {
            for (let index = 0; index < qtyParcelas; index++) {
                if (index === 0) {
                    jurosAtual = valorFinanciamento -
                        (valorFinanciamento - (valorFinanciamento * taxa))
                }
                value = valorFinanciamento * (Math.pow((1 + taxa), qtyParcelas) * taxa) / (Math.pow((1 + taxa), qtyParcelas) - 1)
                valueParacelas = value.toLocaleString('pt-br',
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })
                if (totalPago) {
                    jurosAtual = saldoAtual * taxa
                    saldoAtual = saldoAtual - (value - jurosAtual)
                } else {
                    saldoAtual = valorFinanciamento - (value - jurosAtual)
                }
                totalPago += value
                valueAmortizacao = (jurosAtual - value).toLocaleString('pt-br',
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).replace('-', '')
                    
                render(index, valueParacelas, valueAmortizacao, jurosAtual, saldoAtual)
            }
        } else if (table === 'sac') {
            for (let index = 0; index < qtyParcelas; index++) {
                valueAmortizacao = valorFinanciamento / qtyParcelas
                parcelasPG = index
                const value = valueAmortizacao + taxa * (valorFinanciamento - (parcelasPG * valueAmortizacao))
                totalPago += value
                valueParacelas = value.toLocaleString('pt-br',
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })
                jurosAtual = value - valueAmortizacao
                saldoAtual = valorFinanciamento - valueAmortizacao * (parcelasPG + 1)

                const parcela = valueAmortizacao.toLocaleString('pt-br',
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })
                render(index, valueParacelas, parcela, jurosAtual, saldoAtual)
            }
        }
        function render(index, valueParacelas, valueAmortizacao, jurosAtual, saldoAtual) {
            const p = document.createElement('p')
            p.innerHTML = `<span>${index + 1}</span> 
                <span>${valueParacelas}</span>
                <span>${valueAmortizacao}</span>
                <span>${jurosAtual.toLocaleString('pt-br',
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).replace('R$', '')}
                </span>
                <span>${saldoAtual.toLocaleString('pt-br',
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}</span>`
            divParcela.appendChild(p)
        }
        none.classList.remove('none')
        resultado.append(div)
        resumo.setAttribute("style", "font-size: .8em;")
        resumo.innerHTML += `<p><span class='bold'>Total pago:</span> 
        <span class='red'>${totalPago.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span></p>`
        totalJuros = totalPago - valorFinanciamento
        resumo.innerHTML += `<p><span class='bold'>Juros:</span>
        <span class='red'>${totalJuros.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span>
         </p>`
    } else {
        textAlert = 'Revise as informações passadas !'
        alert(textAlert)
    }
}