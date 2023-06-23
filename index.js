const { HttpWebServer, METHOD, StateHandler, repeat } = require("@imposterlabs/project")
const { InMemoryAdapter } = require("@imposterlabs/in-memory-database-adapter")

const server = new HttpWebServer()
const databaseHandler = new InMemoryAdapter()
server.attachDatabase(databaseHandler)


const { get: getCounter, set: SetCounter } = new StateHandler(0).getPair()

const juspay = {
    VALIDATE_VPA: "/api/n4/merchants/vpas/validity360",
}

const routeMaps = [
    {
        method: METHOD.POST,
        url: juspay.VALIDATE_VPA,
        response: ({ faker, request: { body } }) => {
            const { upiRequestId, vpa } = body
            return {
                "status": "SUCCESS",
                "responseMessage": "SUCCESS",
                "responseCode": "SUCCESS",
                "payload": {
                    "merchantChannelId": "FAMPAYAPPTEST",
                    "gatewayResponseStatus": "SUCCESS",
                    "vpa": vpa,
                    "merchantId": "FAMPAYTEST",
                    "isMerchant": "false",
                    "gatewayResponseMessage": "Your transaction is successful",
                    "gatewayResponseCode": "00",
                    "accType": "SAVINGS",
                    "gatewayTransactionId": upiRequestId,
                    "name": faker.name.findName(),
                    "ifsc": "AABC0009009",
                    "iin": "500001"
                },
                "udfParameters": "{}"
            }
        }
        // before: ['TRIGGER_1'],
        // after: ['TRIGGER_2'],
    },
    {
        method: METHOD.GET,
        url: "/simple/counter",
        response: () => {
            const counter = getCounter()
            SetCounter(counter + 1)
            return { counter }

        }
    }

]

server.registerRoutes(routeMaps)
server.start()

