import { app } from './app'

const main = async () => {
    const port = process.env.EXPRESS_PORT || 8080
    app.listen(port, () => {
        console.log(
            `⚡️[server]: Server is running at https://localhost:${port}`
        )
    })
}
main()
