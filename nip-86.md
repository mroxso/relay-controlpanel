NIP-86
======

Relay Management API
--------------------

`draft` `optional`

Relays may provide an API for performing management tasks. This is made available as a JSON-RPC-like request-response protocol over HTTP, on the same URI as the relay's websocket.

When a relay receives an HTTP(s) request with a `Content-Type` header of `application/nostr+json+rpc` to a URI supporting WebSocket upgrades, it should parse the request as a JSON document with the following fields:

```json
{
  "method": "<method-name>",
  "params": ["<array>", "<of>", "<parameters>"]
}
```

Then it should return a response in the format

```json
{
  "result": {"<arbitrary>": "<value>"},
  "error": "<optional error message, if the call has errored>"
}
```

This is the list of **methods** that may be supported:

* `supportedmethods`:
  - params: `[]`
  - result: `["<method-name>", "<method-name>", ...]` (an array with the names of all the other supported methods)
* `banpubkey`:
  - params: `["<32-byte-hex-public-key>", "<optional-reason>"]`
  - result: `true` (a boolean always set to `true`)
* `listbannedpubkeys`:
  - params: `[]`
  - result: `[{"pubkey": "<32-byte-hex>", "reason": "<optional-reason>"}, ...]`, an array of objects
* `allowpubkey`:
  - params: `["<32-byte-hex-public-key>", "<optional-reason>"]`
  - result: `true` (a boolean always set to `true`)
* `listallowedpubkeys`:
  - params: `[]`
  - result: `[{"pubkey": "<32-byte-hex>", "reason": "<optional-reason>"}, ...]`, an array of objects
* `listeventsneedingmoderation`:
  - params: `[]`
  - result: `[{"id": "<32-byte-hex>", "reason": "<optional-reason>"}]`, an array of objects
* `allowevent`:
  - params: `["<32-byte-hex-event-id>", "<optional-reason>"]`
  - result: `true` (a boolean always set to `true`)
* `banevent`:
  - params: `["<32-byte-hex-event-id>", "<optional-reason>"]`
  - result: `true` (a boolean always set to `true`)
* `listbannedevents`:
  - params: `[]`
  - result: `[{"id": "<32-byte hex>", "reason": "<optional-reason>"}, ...]`, an array of objects
* `changerelayname`:
  - params: `["<new-name>"]`
  - result: `true` (a boolean always set to `true`)
* `changerelaydescription`:
  - params: `["<new-description>"]`
  - result: `true` (a boolean always set to `true`)
* `changerelayicon`:
  - params: `["<new-icon-url>"]`
  - result: `true` (a boolean always set to `true`)
* `allowkind`:
  - params: `[<kind-number>]`
  - result: `true` (a boolean always set to `true`)
* `disallowkind`:
  - params: `[<kind-number>]`
  - result: `true` (a boolean always set to `true`)
* `listallowedkinds`:
  - params: `[]`
  - result: `[<kind-number>, ...]`, an array of numbers
* `blockip`:
  - params: `["<ip-address>", "<optional-reason>"]`
  - result: `true` (a boolean always set to `true`)
* `unblockip`:
  - params: `["<ip-address>"]`
  - result: `true` (a boolean always set to `true`)
* `listblockedips`:
  - params: `[]`
  - result: `[{"ip": "<ip-address>", "reason": "<optional-reason>"}, ...]`, an array of objects

### Authorization

The request must contain an `Authorization` header with a valid [NIP-98](./98.md) event, except the `payload` tag is required. The `u` tag is the relay URL.

If `Authorization` is not provided or is invalid, the endpoint should return a 401 response.