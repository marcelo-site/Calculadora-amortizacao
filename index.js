const form = document.querySelector('#form')
const resultado = document.querySelector('#resultado')
const resumo = document.querySelector('#resumo')
const h2 = document.querySelector('#resultado h2')
const none = document.querySelector('.none')
const div = document.createElement('div')
const price = document.querySelector('#label-price')
const sac = document.querySelector('#label-sac')
const tabela = form.tabela
const button = document.querySelector('button')
const textFinanPoup = document.querySelector('#finan-poup')
textFinanPoup.innerHTML = 'financiamento'
const finanPoup = document.querySelectorAll('[data-financ]')
const tab = document.querySelectorAll('.tab')
const labelPerido = document.querySelector('#label-periodo')
let poupanca = false
let calc = false
let textAlert = ''

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
    })
})
const replaceInput = (el) => {
    el.addEventListener('input', function () {
        this.value = this.value
            .replace(/[^0-9.|,]/g, '')
            .replace(/(\*?)\*/g, '$1');
    })
}
replaceInput(form.valor)
replaceInput(form.taxa)

form.addEventListener('submit', (event) => {
    event.preventDefault()
    calc = true
    if (poupanca === false) {
        calcular()
    } else {
        poup()
    }
})

const alert = (text) => {
    div.classList.add('alert')
    div.innerHTML = text
    return resumo.append(div)
}

const render = (param1, param2, param3, param4, param5) => {
    resultado.innerHTML +=
        `<p class="grid grid5"><span>${param1 + 1}</span> 
        <span>${param2.toLocaleString('pt-br', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}</span>
        <span>${param3.toLocaleString('pt-br', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).replace('-', '')
        }</span>
        <span>${param4.toLocaleString('pt-br', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).replace('-', '')}</span>
        <span>${param5.toLocaleString('pt-br', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).replace('-', '')}</span></p>`
}

const resum = (param1, param2) => {
    const juros = param1 - param2
    none.classList.remove('none')
    resumo.innerHTML = `<p style="margin-bottom: -.3em;">
    <span class='bold'>Montante
    <span style="font-weight: 100; font-size: .8em;">(valor inicial + juros)</span>:
    </span> 
    <span class='red'>${param1.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span></p>
    
    <p><span class='bold'>Juros:</span>
    <span class='red'>${juros.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span></p>`
    button.classList.remove('none')
}

const simbolMatch = () => {
    const financMatch = form.valor.value.match(/\,/g) || []
    const taxaMatch = form.taxa.value.match(/\,/g) || []

    if (financMatch.length > 1 || taxaMatch.length > 1) {
        textAlert = "Para separar a casa dos milhares use ponto em vez de virgulas!"
        none.classList.add('none')
        resumo.innerHTML = ''
        button.classList.add('none')
        alert(textAlert)
        return true
    }
}

const calcular = () => {
    resultado.innerHTML = `<div class="grid grid5 bold">
    <span>N<sup>o</sup></span>
    <span>Parcelas</span>
    <span>Amortizações</span>
    <span>Juros</span>
    <span> Saldo Devedor</span></div>`

    const taxa = parseFloat(form.taxa.value.replace(/\,/g, '.')) / 100
    const periodo = form.periodo.value  // Número de Parcelas(Período)
    let table = form.tabela.value  // Regra de juros tabela PRICE || SAC
    let valueAmortizacao = 0    // Amortização=> a = valorFinanciamento/periodo ;  
    let parcelasPG = 0          // Número de Parcelas Pagas 
    let totalPago = 0           // Total pago com juros
    let valueParacelas = 0      // Valor das parcelas
    let saldoDevedor = 0        // Divda restante sem juros
    let jurosMes = 0            // Montante de juros pago no mês

    div.classList.add('table')
    div.classList.remove('alert')

    if (form.valor.value && form.taxa.value && form.periodo.value) {
        if (simbolMatch()) {
            return simbolMatch()
        }
        const valorFinanciamento = parseFloat(form.valor.value
            .replace(/\./g, '')
            .replace(/\,/g, '.')
        )
        if (table === 'price') {
            for (let index = 0; index < periodo; index++) {
                if (index === 0) {
                    jurosMes = valorFinanciamento -
                        (valorFinanciamento - (valorFinanciamento * taxa))
                }
                valueParacelas = valorFinanciamento * (Math.pow((1 + taxa), periodo) * taxa) / (Math.pow((1 + taxa), periodo) - 1)
                if (totalPago) {
                    jurosMes = saldoDevedor * taxa
                    saldoDevedor = saldoDevedor - (valueParacelas - jurosMes)
                } else {
                    saldoDevedor = valorFinanciamento - (valueParacelas - jurosMes)
                }
                totalPago += valueParacelas
                valueAmortizacao = (jurosMes - valueParacelas)

                render(index, valueParacelas, valueAmortizacao, jurosMes, saldoDevedor)
            }
        } else if (table === 'sac') {
            for (let index = 0; index < periodo; index++) {
                valueAmortizacao = valorFinanciamento / periodo
                parcelasPG = index
                valueParacelas = valueAmortizacao + taxa * (valorFinanciamento - (parcelasPG * valueAmortizacao))

                totalPago += valueParacelas
                jurosMes = valueParacelas - valueAmortizacao
                saldoDevedor = valorFinanciamento - valueAmortizacao * (parcelasPG + 1)

                render(index, valueParacelas, valueAmortizacao, jurosMes, saldoDevedor)
            }
        }
        resum(totalPago, valorFinanciamento)
    } else {
        textAlert = 'Revise as informações passadas !'
        alert(textAlert)
    }
}
const limpar = () => {
    calc = false
    resultado.innerHTML = ''
    resumo.innerHTML = ''
    none.classList.add('none')
    form.valor.value = ''
    form.taxa.value = ''
    form.periodo.value = ''
    button.classList.add('none')
    tabela[0].click()
}
button.addEventListener('click', (e) => {
    e.preventDefault()
    limpar()
})