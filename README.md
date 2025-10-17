# DevSecOps Guardrail no PR

Pipeline que roda SCA/Container/IaC scans em **cada PR**, **bloqueia** vulnerabilidades **HIGH/CRITICAL**, gera **SBOM (SPDX)** e publica relatórios como artefatos.

## Como funciona
1. A cada **push** ou **pull_request**, o GitHub Actions executa:
   - `Trivy fs` (scan do repositório)
   - build da imagem Docker e `Trivy image`
   - geração de **SBOM** (SPDX) com `anchore/sbom-action`
   - (opcional) `tfsec` se existir `infra/**/*.tf`
2. Se qualquer scan encontrar **HIGH/CRITICAL**, o job retorna **exit 1** e o PR fica **vermelho**.

## Como testar (demo rápida)
- Crie uma branch e adicione uma dependência vulnerável (ex.: uma versão antiga de `lodash`).
- Abra um PR para `main`. O pipeline deve **falhar**.
- Atualize a dependência para versão segura. O pipeline deve **passar**.

## Artefatos
- `sbom.spdx.json` disponível nos artefatos do workflow.

## Rodando local (opcional)
```bash
make build
make run         # abre http://localhost:3000
```

## Próximos passos
- Ativar **CodeQL** (SAST) para linguagens suportadas.
- Assinar imagens com **cosign** e publicar **SBOM** junto ao release.
- Adicionar política de isenção por código (permitir CVE específico com justificativa).
