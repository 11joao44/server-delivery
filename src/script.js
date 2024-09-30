function redirectToSignup() {
    window.location.href = 'login.html';
}

function loadSelectedPlan(plan) {
    const planElement = document.getElementById('selected-plan');
    planElement.textContent = plan;
}

loadSelectedPlan("Plano Semestral - R$ 239,00/mês");

function handleLogin(method) {
    if (method === 'google') {
        alert("Login com Google não implementado.");
    }
}

function showSignup() {
    alert("Redirecionar para a página de criação de conta.");
}