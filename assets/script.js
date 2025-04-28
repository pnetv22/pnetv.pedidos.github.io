// Carregar contas do arquivo JSON via GitHub Raw
async function loadAccounts() {
    const response = await fetch('https://raw.githubusercontent.com/SEU_USUARIO/meu-iptv-painel/main/accounts.json');
    const data = await response.json();
    document.getElementById('contas').innerHTML = data.contas_principais
        .map(conta => `
            <div>
                <h3>${conta.username}</h3>
                ${conta.temporarias.map(temp => `
                    <p>
                        ${temp.username} - Expira em ${new Date(temp.expira_em).toLocaleString()}
                        <button onclick="deleteAccount('${temp.username}')">Excluir</button>
                    </p>
                `).join('')}
            </div>
        `).join('');
}

// Criar conta temporária (dispara GitHub Action)
async function createTempAccount() {
    await fetch('https://api.github.com/repos/SEU_USUARIO/meu-iptv-painel/dispatches', {
        method: 'POST',
        headers: {
            'Authorization': 'token SEU_TOKEN_GITHUB',
            'Accept': 'application/vnd.github.everest-preview+json'
        },
        body: JSON.stringify({
            event_type: 'create_temp_account',
            client_payload: {
                main_username: '2168253',
                hours: 2
            }
        })
    });
    setTimeout(loadAccounts, 5000); // Aguarda 5s para atualizar
}

// Excluir conta (dispara GitHub Action)
async function deleteAccount(username) {
    await fetch('https://api.github.com/repos/SEU_USUARIO/meu-iptv-painel/dispatches', {
        method: 'POST',
        headers: {
            'Authorization': 'token SEU_TOKEN_GITHUB',
            'Accept': 'application/vnd.github.everest-preview+json'
        },
        body: JSON.stringify({
            event_type: 'delete_temp_account',
            client_payload: { username }
        })
    });
    setTimeout(loadAccounts, 5000);
}

// Inicializar
loadAccounts();
