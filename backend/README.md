Copy `env-template` rename to `.env`

```
npm i
```

Generate self-signed certificates:

```
openssl req -nodes -new -x509 -keyout server.key -out server.cert
```

Start server:

```
npm run dev
```

NOTE: Chrome might not accept the self signed certificate, you can force it to by setting this flag to `enabled`:

```
chrome://flags/#allow-insecure-localhost
```
