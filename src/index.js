const { IncomingWebhook } = require("@slack/webhook");
const failedColor = "#ff0000";
const successColor = "#7CFC00";
class SlackService {
    constructor(config) {
        this.config = config;
        if (!this.config.webhook) {
            console.error(
                "[slack-reporter] Slack Webhook URL is not configured, notifications will not be sent to slack."
            );
            return;
        }
        if (!this.config.notify) {
            console.debug("[slack-reporter] Slack reporter is disabled")
            return;
        }
        this.webhook = new IncomingWebhook(this.config.webhook);
        this.message = this.config.message || "Starting a test job";
        this.attachments = [
            {
                pretext: `*${this.message}*`,
            }
        ];
    }

    afterTest(test) {
        if (test.passed) {
            console.log(test); 
            let attach = {
                color: successColor,
                author_name: test.fullTitle,
                footer: test.error.stack,
                ts: Date.now()
            };
            this.attachments.push(attach);
        }
    }

    async after() {
        await this.webhook.send({
            attachments: this.attachments
        });
    }
}

module.exports = SlackService;
