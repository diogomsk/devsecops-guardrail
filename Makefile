  .PHONY: build run scan-fs scan-img sbom

  build:
		docker build -t local/hello-secure-world:dev ./app

  run:
		docker run --rm -p 3000:3000 local/hello-secure-world:dev

  scan-fs:
		trivy fs --ignore-unfixed --severity HIGH,CRITICAL .

  scan-img: build
		trivy image --ignore-unfixed --severity HIGH,CRITICAL local/hello-secure-world:dev

  sbom:
		syft packages dir:./app -o spdx-json > sbom.spdx.json
