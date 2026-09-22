# Swipe por gesto nas vagas

## Alterações
- Instalar `framer-motion`.
- Tornar o cartão arrastável horizontalmente por mouse ou toque.
- Exibir os selos progressivos “MATCH” e “PASSAR”, com inclinação proporcional ao movimento.
- Aplicar limite de decisão em 120px: além dele, o cartão sai animado e executa a ação; antes dele, retorna ao centro com efeito de mola.
- Manter os botões de alternativa, usando a mesma animação e lógica do gesto.
- Mostrar uma prévia discreta da próxima vaga atrás do cartão atual.
- Bloquear interações repetidas enquanto a animação ou candidatura estiver em andamento.

## Validação
- Conferir arraste para ambos os lados, retorno ao centro e ações pelos botões.
- Verificar a página em tela ampla e móvel, sem erros de compilação ou execução.
