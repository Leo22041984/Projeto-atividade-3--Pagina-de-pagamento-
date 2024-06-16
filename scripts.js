document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('informarDados').addEventListener('click', function () {
        const valor = parseFloat(document.getElementById('valor').value);
        const mensagem = document.getElementById('mensagem');
        const painelPix = document.getElementById('painelPix');
        const painelCartao = document.getElementById('painelCartao');
        const totalPix = document.getElementById('totalPix');
        const metodoPagamento = document.getElementById('metodoPagamento');
        const pagarButton = document.getElementById('pagar');
        const container = document.querySelector('.container');
        const erroCPF = document.getElementById('erroCPF');
        const cpfInput = document.getElementById('cpf');

        // Ocultar mensagens e painéis
        mensagem.classList.add('oculto');
        painelPix.classList.add('oculto');
        painelCartao.classList.add('oculto');
        pagarButton.classList.add('oculto');
        erroCPF.classList.add('oculto');

        // Verificar se o valor foi preenchido
        if (!valor) {
            mensagem.textContent = 'O campo valor deve ser preenchido.';
            mensagem.classList.remove('oculto');
            return;
        }

        // Mostrar opções de método de pagamento
        metodoPagamento.classList.remove('oculto');

        // Adicionar eventos aos métodos de pagamento
        const metodos = document.querySelectorAll('input[name="metodo"]');
        metodos.forEach(metodo => {
            metodo.addEventListener('change', function () {
                container.classList.add('selecionado'); 
                if (metodo.value === 'pix') {
                    totalPix.textContent = (valor * 0.9).toFixed(2); // Calcular desconto no pagamento via Pix
                    painelPix.classList.remove('oculto');
                    painelCartao.classList.add('oculto');
                } else if (metodo.value === 'cartao') {
                    atualizarTotalCartao(valor, 1);
                    painelCartao.classList.remove('oculto');
                    painelPix.classList.add('oculto');
                }
                pagarButton.classList.remove('oculto');
            });
        });
    });

    document.getElementById('numeroCartao').addEventListener('input', function () {
        const numeroCartao = this.value;
        const iconeCartao = document.getElementById('iconeCartao');
        const erroCartao = document.getElementById('erroCartao');

        // Resetar ícone e erro
        iconeCartao.style.backgroundImage = 'none';
        erroCartao.classList.add('oculto');

        // Verificar a bandeira do cartão
        if (numeroCartao.startsWith('1234')) {
            iconeCartao.style.backgroundImage = 'url("img/icons8-visa-120.png")';
        } else if (numeroCartao.startsWith('4321')) {
            iconeCartao.style.backgroundImage = 'url("img/icons8-mastercard-120.png")';
        } else if (numeroCartao.length >= 4) {
            erroCartao.classList.remove('oculto');
        }
    });

    document.getElementById('parcelas').addEventListener('change', function () {
        const valor = parseFloat(document.getElementById('valor').value);
        const parcelas = parseInt(this.value);

        // Atualizar o total do cartão
        atualizarTotalCartao(valor, parcelas);
    });

    document.getElementById('pagar').addEventListener('click', function () {
        const mensagemSucesso = document.getElementById('mensagemSucesso');
        const container = document.querySelector('.container');
        const painelPix = document.getElementById('painelPix');
        const painelCartao = document.getElementById('painelCartao');
        const cpfInput = document.getElementById('cpf');
        const erroCPF = document.getElementById('erroCPF');

        // Validação do CPF
        if (painelPix.classList.contains('oculto') === false && !validarCPF(cpfInput.value)) {
            erroCPF.classList.remove('oculto');
            return;
        }

        // Validação dos campos do cartão de crédito
        const numeroCartao = document.getElementById('numeroCartao').value;
        const nomeTitular = document.getElementById('nomeTitular').value;
        const codigoSeguranca = document.getElementById('codigoSeguranca').value;
        const vencimento = document.getElementById('vencimento').value;

        if (painelCartao.classList.contains('oculto') === false) {
            if (!numeroCartao || !nomeTitular || !codigoSeguranca || !vencimento) {
                mensagem.textContent = 'Todos os campos do cartão de crédito devem ser preenchidos.';
                mensagem.classList.remove('oculto');
                return;
            }
        }

        // Mostrar mensagem de sucesso
        mensagemSucesso.classList.remove('oculto');
        setTimeout(() => {
            mensagemSucesso.classList.add('oculto');
            container.classList.remove('selecionado');
            document.getElementById('formPagamento').reset();
            painelPix.classList.add('oculto');
            painelCartao.classList.add('oculto');
            document.getElementById('metodoPagamento').classList.add('oculto');
            document.getElementById('pagar').classList.add('oculto');
        }, 3000); // 3 segundos de espera antes de ocultar a mensagem de sucesso e voltar a pagina inicial
    });

    function atualizarTotalCartao(valor, parcelas) {
        let total = valor;

        // Calcular juros de acordo com as parcelas
        if (parcelas === 4) {
            total *= 1.05;
        } else if (parcelas === 5) {
            total *= 1.10;
        }

        const valorParcela = total / parcelas;

        document.getElementById('totalCartao').textContent = total.toFixed(2);
        document.getElementById('valorParcela').textContent = valorParcela.toFixed(2);
    }
    
    // Função para validar o numero do cpf 
    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 ||
            /^(\d)\1{10}$/.test(cpf)) return false;
        let soma = 0, resto;
        for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;
        soma = 0;
        for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(10, 11))) return false;
        return true;
    }
});
