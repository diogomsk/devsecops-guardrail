# 🛡️ DevSecOps Guardrail

Um projeto prático de **DevSecOps** usando **GitHub Actions, Docker e Trivy** para criar uma pipeline que **analisa vulnerabilidades automaticamente** e **bloqueia código inseguro antes de ir pra main**.

---

## O que esse projeto faz

Toda vez que alguém faz um **push** ou abre um **pull request**, o pipeline:

1. **Constrói o container** da aplicação (`hello-secure-world`);
2. **Roda scanners de segurança** (Trivy e tfsec);
3. **Gera um SBOM** (Software Bill of Materials) no formato SPDX;
4. **Bloqueia o PR** se encontrar vulnerabilidades **HIGH ou CRITICAL**.

Resultado: nada inseguro chega na `main` sem revisão.

---

## Tecnologias usadas

-   **GitHub Actions** – automação do pipeline CI/CD
-   **Docker** – container da aplicação Node.js
-   **Trivy** – scanner de vulnerabilidades (app + imagem)
-   **tfsec** – scanner de segurança para IaC (Terraform) Nota: O tfsec já está integrado no workflow, mas não há arquivos Terraform neste projeto — então ele não executa nenhuma verificação prática.
    A ideia é deixar o scanner pronto para quando forem adicionados módulos de infraestrutura (IaC) no futuro.
-   **Anchore SBOM Action** – geração de inventário SPDX

---

## Conceito principal

A ideia é **simular um guardrail de segurança real**, igual ao que times de DevSecOps usam em empresas.

➡️ Quando o código é seguro → o pipeline fica **verde** e gera o artefato `sbom-spdx`.  
➡️ Quando o código tem vulnerabilidade → o pipeline fica **vermelho** e bloqueia o merge.

---

## Rodando o app localmente

O app é simples — um pequeno servidor Node.js que mostra uma página HTML com a mensagem “hello-secure-world”.
Ele roda dentro de um container Docker e é o artefato usado pelo pipeline para os testes de segurança.

```bash
cd app
docker build -t local/hello-secure-world:dev .
docker run --rm -p 3000:3000 local/hello-secure-world:dev
```

Acesse no navegador:

```
http://localhost:3000
```

Deve aparecer:

```
hello-secure-world
```

---

## Quebrando de propósito (testando o guardrail)

1. Crie uma branch nova:

    ```bash
    git checkout -b feat/vuln-demo
    ```

2. Adicione uma dependência vulnerável:

    ```bash
    cd app
    npm i lodash@4.17.19
    cd ..
    git add app/package.json app/package-lock.json
    git commit -m "teste: add vulnerabilidade"
    git push -u origin feat/vuln-demo
    ```

3. Abra um **Pull Request** `feat/vuln-demo → main`.

O workflow vai rodar e o PR deve aparecer com **status vermelho** ❌  
Clique em **Details → Trivy FS** ou **Trivy Image** para ver os **CVEs detectados**.

---

## Corrigindo e voltando ao verde

Remova ou atualize a dependência:

```bash
cd app
npm uninstall lodash
cd ..
git add app/package.json app/package-lock.json
git commit -m "fix: remove vulnerable lodash"
git push
```

O PR vai rodar novamente e deve ficar **verde** ✅  
Faça o **merge** — o SBOM será gerado nos artifacts.

---

## Artefatos gerados

Após o build bem-sucedido, o GitHub Actions gera:

-   `sbom-spdx.json` – inventário completo de dependências (SPDX format).

Esse arquivo pode ser usado para auditoria, rastreabilidade e compliance.

:)
