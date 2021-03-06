//Máscaras do formulário de cadastro
$('#dataNascimento').on('focus', function() {
    var id = $(this).attr("id");
    if (id == "dataNascimento") { VMasker(document.querySelector("#dataNascimento")).maskPattern("99/99/9999") };
});

$('#telefone').on('focus', function() {
    var id = $(this).attr("id");
    if (id == "telefone") { VMasker(document.querySelector("#telefone")).maskPattern("+999 999 999 999") };
});

//Retorno do caminho absoluto (root)
function getRoot() {
    var root = "http://" + document.location.hostname + "/personal/";
    return root;
}

//Recaptcha
function getCaptcha() {
    grecaptcha.ready(function() {
        grecaptcha.execute('6Lf-sP8UAAAAAJBsCaxkocgA4CfOaLlvGv-TyYfm', { action: 'login' }).then(function(token) {
            const gRecaptchaResponse = document.querySelector("#g-recaptcha-response").value = token;
        });
    });
};

getCaptcha();

//Ajax do formulário de cadastro
$("#formCadastro").on("submit", function(event) {
    event.preventDefault(); //evita refresh da página
    var dados = $(this).serialize(); //envia os dados do input

    $.ajax({
        url: getRoot() + 'controllers/controllerCadastro',
        type: 'post',
        dataType: 'json',
        data: dados,
        success: function(response) {
            $('.retornoCad').empty();
            if (response.retorno == "erro") {
                getCaptcha();
                $.each(response.erros, function(key, value) {
                    $('.retornoCad').append(value + '<br>');
                    swal(value, "", "error");
                });
            }
            if(response.retorno === "success"){
                swal("Cadastro realizado com sucesso!", "Por favor, confirme seu e-mail.", "success");
                //$('.retornoCad').append('Cadastro realizado com sucesso!');
            }
        }
    });
});


//Ajax do formulário de login
$("#formLogin").on("submit", function(event) {
    event.preventDefault(); //evita refresh da página
    var dados = $(this).serialize(); //envia os dados do input

    $.ajax({
        url: getRoot() + 'controllers/controllerLogin',
        type: 'post',
        dataType: 'json',
        data: dados,

        success: function(response) {
            //console.log(response);
            if (response.retorno == 'success') {
                window.location.href = response.page;
            } else {
                getCaptcha();
                if (response.tentativas == true) {
                    $('.form-login').hide();
                }
                $('.resultadoForm').empty();
                $.each(response.erros, function(key, value) {
                    $('.resultadoForm').append(value + '<br>')
                });
            }
        }
    });
});


// CapsLock


$("#senha").on("keyup", function(e) {

    if (e.originalEvent.getModifierState("CapsLock")) {
        $(".resultadoForm").html("Capslock Ativado");
    } else {
        $(".resultadoForm").empty();
    }
});