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
const render = (param1, param2, param3, param4, param5, param6) => {
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
        }).replace('-', '')}</span>
        <span>${param6.toLocaleString('pt-br', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).replace('-', '')}</span></p>`
}
const resum = (param1, param2, param3, param4) => {
    const jurosIof1 = param4.reduce((acc, cur) => acc + cur) 
    - param3
    const juros = param1 - param2
        + jurosIof1
    const iof = 
    param3 + 
    jurosIof1
    none.classList.remove('none')
    resumo.innerHTML = `<p style="margin-bottom: -.3em;">
    <span class='bold'>Total Pago:</span> 
    <span class='red'>${param1.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span></p>
    
    <p><span class='bold'>Juros:</span>
    <span class='red'>${juros.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span></p>
    <p><span class='bold'>IOF:</span>
    <span class='red'>${iof.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span></p>`
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
const date = new Date('2021/09/20')
// let date = new Date
let month = date.getMonth()

let mesAnterior = new Date(date.setMonth(date.getMonth() - 1))
const imp = 0.0082 / 100

const arrIofMes = []
const yearAtual = date.getFullYear()
const calcular = () => {
    let year = 0
    let limitDayIof = 0
    let totIof = 0
    const iof = (param) => {
        let mes = (month + param) % 12
        if (mes === 0) {
            year = parseInt(yearAtual) + 1
        }
        if (limitDayIof < 360) {
            if (mes !== 1 && (mes < 7 && mes % 2 === 0) ||
                (mes >= 7 && mes % 2 !== 0)) {
                limitDayIof += 31
            }
            else if (mes !== 1 && (mes < 7 && mes % 2 !== 0) ||
                (mes >= 7 && mes % 2 === 0)) {
                limitDayIof += 30
            }
            else if (mes === 1 && year % 4 !== 0) {
                limitDayIof += 28
            }
            else if (mes === 1 && year % 4 === 0) {
                limitDayIof += 29
            }
        }
    }
    resultado.innerHTML = `<div class="grid grid5 bold" style="font-size: .9em;">
    <span>N<sup>o</sup></span>
    <span>Parcelas</span>
    <span>Amortizações</span>
    <span>IOF</span>
    <span>Juros</span>
    <span> Saldo Devedor</span></div>`

    const taxa = parseFloat(form.taxa.value.replace(/\,/g, '.')) / 100
    const periodo = form.periodo.value  // Número de Parcelas(Período)
    let table = form.tabela.value  // Regra de juros tabela PRICE || SAC
    let valueAmortizacao = 0    // Amortização=> a = valorFinanciamento/periodo ;  
    let parcelasPG = 0          // Número de Parcelas Pagas 
    let totalPago = 0           // Total pago com juros
    let valueParcelas = 0      // Valor das parcelas
    let saldoDevedor = 0        // Divda restante sem juros
    let jurosMes = 0            // Montante de juros pago no mês
    const iofFixo = 0.38 / 100
    let taxaIof = 0
    div.classList.add('table')
    div.classList.remove('alert')

    if (form.valor.value && form.taxa.value && form.periodo.value) {
        if (simbolMatch()) {
            return simbolMatch()
        }
        let valorFinanciamento = parseFloat(form.valor.value
            .replace(/\./g, '')
            .replace(/\,/g, '.')
        )
        const jurosIof = []
        if (table === 'price') {
            const arr = []
            valueParcelas = valorFinanciamento * (Math.pow((1 + taxa), periodo) * taxa) / (Math.pow((1 + taxa), periodo) - 1)
            for (let index = 0; index < periodo; index++) {
                if (index === 0) {
                    jurosMes = valorFinanciamento -
                        (valorFinanciamento - (valorFinanciamento * taxa))
                }
                if (totalPago) {
                    jurosMes = saldoDevedor * taxa
                    saldoDevedor = saldoDevedor - (valueParcelas - jurosMes)
                } else {
                    saldoDevedor = valorFinanciamento - (valueParcelas - jurosMes)
                }
                valueAmortizacao = valueParcelas - jurosMes
                iof(index)
                taxaIof = valueAmortizacao * imp * limitDayIof
                totIof += taxaIof

                totalPago += valueParcelas
                const obj = {
                    index,
                    valueParcelas,
                    valueAmortizacao,
                    taxaIof,
                    jurosMes,
                    saldoDevedor
                }
                arr.push(obj)
            }
            totIof = totIof + iofFixo * valorFinanciamento
            let totIofParcela = 0
            arr.map((el, i) => {
                // if (i < arr.length) {
                totIofParcela = totIof * (Math.pow((1 + taxa), periodo) * taxa) / (Math.pow((1 + taxa), periodo) - 1)
                jurosIof.push(totIofParcela)
                // }
                const valueParcelas = el.valueParcelas
                    + totIofParcela
                render(el.index,
                    valueParcelas,
                    el.valueAmortizacao,
                    el.taxaIof,
                    el.jurosMes,
                    el.saldoDevedor)
            })
        } else if (table === 'sac') {
            valueAmortizacao = valorFinanciamento / periodo

            for (let i = 0; i < periodo; i++) {
                iof(i)
                const taxaIof = valueAmortizacao * imp * limitDayIof
                totIof += taxaIof * valorFinanciamento

                parcelasPG = i
                valueParcelas = valueAmortizacao + taxa * (valorFinanciamento - (parcelasPG * valueAmortizacao)) + taxaIof

                totalPago += valueParcelas
                jurosMes = valueParcelas - valueAmortizacao
                saldoDevedor = valorFinanciamento - valueAmortizacao * (parcelasPG + 1)

                render(i, valueParcelas, valueAmortizacao, taxaIof, jurosMes, saldoDevedor)
            }
            totIof = totIof + iofFixo
        }
        resum(totalPago, valorFinanciamento, totIof, jurosIof)
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