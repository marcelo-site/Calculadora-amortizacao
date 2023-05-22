const form = document.querySelector('#form')
const resultado = document.querySelector('#resultado')
const resumo = document.querySelector('#resumo')
const h2 = document.querySelector('#resultado h2')
const none = document.querySelector('.none')

document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault()
    calcular()
})

function calcular() {
    const valorFinanciamento = parseFloat(form.emprestimo.value.replace('.', ''))
    const taxa = parseFloat(form.taxa.value) / 100  // Taxa de Juros ( ao mês)
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

    const div = document.createElement('div')
    div.classList.add('sac')
    resultado.innerHTML = ''
    resumo.innerHTML = ''
    if (valorFinanciamento && taxa && qtyParcelas) {
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

                render(index, valueParacelas, valueAmortizacao, jurosAtual, saldoAtual)
            }
        } else if (table === 'sac') {
            for (let index = 0; index < qtyParcelas; index++) {
                valueAmortização = valorFinanciamento / qtyParcelas
                parcelasPG = index
                const value = valueAmortização + taxa * (valorFinanciamento - (parcelasPG * valueAmortização))
                totalPago += value
                valueParacelas = value.toLocaleString('pt-br',
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })
                jurosAtual = value - valueAmortização
                saldoAtual = valorFinanciamento - valueAmortização * (parcelasPG + 1)

                render(index, valueParacelas, valueAmortizacao, jurosAtual, saldoAtual)
            }
        }
        //
        function render(index, valueParacelas, valueAmortizacao, jurosAtual, saldoAtual) {
            const p = document.createElement('p')
            valueAmortizacao = (jurosAtual - value).toLocaleString('pt-br',
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).replace('-', '')

            p.innerHTML =
                `<span>${index + 1}</span> 
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
        const resumo = document.querySelector('#resumo')
        resumo.setAttribute("style", "font-size: .8em;")
        resumo.innerHTML += `<p><span class='bold'>Total pago:</span> 
        <span class='red'>${totalPago.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span>
        </p>`
        totalJuros = totalPago - valorFinanciamento
        resumo.innerHTML += `<p><span class='bold'>Juros:</span>
        <span class='red'>${totalJuros.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</span>
         </p>`
    } else {
        div.classList.add('alerta')
        div.innerHTML = 'Revise as informações passadas !'
        resultado.append(div)
    }
}