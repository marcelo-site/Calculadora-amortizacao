const form = document.querySelector('#form')
const resultado = document.querySelector('#resultado')
const resumo = document.querySelector('#resumo')
const h2 = document.querySelector('#resultado h2')
const none = document.querySelector('.none')
const div = document.createElement('div')
const divParcela = resultado.appendChild(div)
let textAlert = ''
const price = document.querySelector('#label-price')
const sac = document.querySelector('#label-sac')
const tabela = form.tabela
let calc = false

const active = (node1, node2) => {
    node1.classList.toggle('active')
    node1.classList.toggle('inactive')
    node2.classList.toggle('active')
    node2.classList.toggle('inactive')
}
tabela.forEach(el => {
    el.addEventListener('change', () => {
        active(price, sac)
        if (calc) {
            calcular()
        }
    })})

const replaceInput = (el) => {
    el.addEventListener('input', function () {
   this.value = this.value
    .replace(/[^0-9.|,]/g, '')
    .replace(/(\*?)\*/g, '$1');
})}
replaceInput(form.financiamento)
replaceInput(form.taxa)

form.addEventListener('submit', (event) => {
    event.preventDefault()
    calc = true
    calcular()
})

const alert = (text) => {
    div.classList.add('alert')
    div.innerHTML = text
    return resumo.append(div)
}

const render = (param1, param2, param3, param4, param5) => {
    divParcela.innerHTML +=
        `<p>
        <span>${param1 + 1}</span> 
        <span>${param2}</span>
        <span>${param3}</span>
        <span>${param4}</span>
        <span>${param5}</span>
        </p>`
}

const calcular = () => {
    resultado.innerHTML = ''
    resumo.innerHTML = ''
    let inpFinanciamento = form.financiamento.value
    let inpTaxa = form.taxa.value

    if (inpFinanciamento && inpTaxa && form.qtyParcelas.value) {
        const financMatch = inpFinanciamento.match(/\,/g) || []
        const taxaMatch = inpTaxa.match(/\,/g) || []

        if (financMatch.length > 1 || taxaMatch.length > 1) {
            textAlert = "Para separar a casa dos milhares use ponto em vez de virgulas!"
            none.classList.add('none')
            return alert(textAlert)
        }
        const valorFinanciamento = parseFloat(inpFinanciamento
            .replace(/\./g, '')
            .replace(/\,/g, '.')
        )
        const taxa = parseFloat(inpTaxa
            .replace(/\,/g, '.')) / 100

        const qtyParcelas = form.qtyParcelas.value  // Número de Parcelas(Período)
        let table = form.tabela.value  // regra de juros tabela price || sac
        let valueAmortizacao = 0    // Amortização=> a = valorFinanciamento/qtyParcelas ;  
        let parcelasPG = 0          // Número de Parcelas Pagas 
        let totalJuros = 0          // Total de juros pagos do financiamento
        let totalPago = 0           // Total pago com juros
        let valueParacelas = 0      // Valor das poarcelas
        let value = 0               // Aux para calcular valueParcelas
        let saldoDevedor = 0        // Financiamento restante sem juros
        let saldoDevedorBR          // saldoDevedor em moeda br
        let jurosValue = 0          // Valor do montante de juros pago no mês
        let jurosValueBR             // jurosValue em moeda br

        div.classList.add('table')
        div.classList.remove('alert')
        divParcela.innerHTML = ''

        if (table === 'price') {
            for (let index = 0; index < qtyParcelas; index++) {
                if (index === 0) {
                    jurosValue = valorFinanciamento -
                        (valorFinanciamento - (valorFinanciamento * taxa))
                }
                value = valorFinanciamento * (Math.pow((1 + taxa), qtyParcelas) * taxa) / (Math.pow((1 + taxa), qtyParcelas) - 1)
                valueParacelas = value.toLocaleString('pt-br',
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })
                if (totalPago) {
                    jurosValue = saldoDevedor * taxa
                    saldoDevedor = saldoDevedor - (value - jurosValue)
                } else {
                    saldoDevedor = valorFinanciamento - (value - jurosValue)
                }
                totalPago += value
                valueAmortizacao = (jurosValue - value).toLocaleString('pt-br',
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).replace('-', '')

                jurosValueBR = jurosValue.toLocaleString('pt-br',
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })
                saldoDevedorBR = saldoDevedor.toLocaleString('pt-br',
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })

                render(index, valueParacelas, valueAmortizacao, jurosValueBR, saldoDevedorBR)
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
                jurosValue = value - valueAmortizacao
                saldoDevedor = valorFinanciamento - valueAmortizacao * (parcelasPG + 1)

                const parcela = valueAmortizacao.toLocaleString('pt-br',
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })
                jurosValueBR = jurosValue.toLocaleString('pt-br',
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })
                saldoDevedorBR = saldoDevedor.toLocaleString('pt-br',
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })
                render(index, valueParacelas, parcela, jurosValueBR, saldoDevedorBR)
            }
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