class GmailPuppeteerHandler {
    constructor(page) {
        this.page = page;
    }

    async authorization(email, password) {
        await this.page.goto('https://accounts.google.com/signin/v2/identifier?continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&service=mail&sacu=1&rip=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin');
        await enterEmail.call(this, email);
        await enterPassword.call(this, password);
        return await this.page.url();

        async function enterEmail(email) {
            await this.page.waitForSelector('#identifierId');
            await this.page.type('#identifierId', email);
            return Promise.all([
                this.page.waitForNavigation({waitUntil: 'networkidle0'}), // The promise resolves after navigation has finished
                this.page.keyboard.press('Enter'),
            ]);
        }

        async function enterPassword(password) {
            await this.page.type('#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input', password);
            return Promise.all([
                this.page.waitForNavigation({waitUntil: 'networkidle2'}), // The promise resolves after navigation has finished
                this.page.click('.VfPpkd-RLmnJb')
            ]);
        }

    }

    async sendMessage(email, theme, message) {
        await openMessageForm.call(this);
        await typeRecipientEmail.call(this, email);
        await typeTheme.call(this, theme);
        await typeMessage.call(this, message);
        await send.call(this);
        return await checkStatusOfMessage.call(this);


        async function openMessageForm() {
            await this.page.waitForSelector('.T-I-KE');
            return this.page.click('.T-I-KE');
        }


        async function typeRecipientEmail(email) {
            await this.page.waitForSelector('.wO.nr.l1 textarea');
            const recipientEmailInput = await this.page.$('.wO.nr.l1 textarea');
            return recipientEmailInput.type(email);
        }

        async function typeTheme(theme) {
            const them = await this.page.$('.aoD.az6 input');
            return them.type(theme);
        }

        async function typeMessage(message) {
            const messageInput = await this.page.$('.Ar.Au > div');
            return messageInput.type(message, {delay: 0});
        }

        async function send() {
            return Promise.all([
                this.page.click('.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3'),
                this.page.waitForNavigation({waitUntil: 'networkidle2'}) // The promise resolves after navigation has finished
            ]);
        }

        async function checkStatusOfMessage() {
            await this.page.waitForSelector('.bAq');
            return new Promise(async function waitSending(resolve) {
                let result = await this.page.evaluate(() => document.querySelector('.bAq').innerText);
                if (result === 'Отправка…') {
                    setTimeout(async () => {
                        await waitSending.bind(this, resolve)()
                    }, 100);
                    return;
                }
                resolve(result);
            }.bind(this))
        }
    }

    async searchLetterNodeId(id, timeout = 30000) {
        const timer = setTimeout(() => {
            throw new Error('letter not found')
        }, timeout);

        const nodeId = await getLetterNodeId.call(this, id);
        clearTimeout(timer);
        return nodeId;

        async function getLetterNodeId(id) {
            return new Promise(async function searchParentId(resolve) {
                let result = await this.page.evaluate((id) => {
                    const letterTheme = Array.from(document.querySelectorAll('.bog > .bqe')).find(theme => theme.innerText === id);
                    if (!letterTheme) return null;
                    return letterTheme.closest('tr').id
                }, id);
                if (!result) {
                    setTimeout(searchParentId.bind(this), 100)
                } else {
                    resolve(result)
                }
            }.bind(this));
        }
    }

    async openLetterByNodeId(nodeId) {
        return Promise.all([
            this.page.click(`#${nodeId}`.replace(/:/g, '\\:')),
            this.page.waitForNavigation({waitUntil: 'networkidle2'}) // The promise resolves after navigation has finished
        ]);
    }

    async getMessageInfo() {
        return await this.page.evaluate((id) => {
            return {
                from: document.querySelector('.iw .go').innerText,
                theme: document.querySelector('.ha .hP').innerText,
                message: document.querySelector('.a3s.aiL > div').innerText
            }
        })
    }

    async getMessageById(id) {
        const nodeId = await this.searchLetterNodeId(id);
        await this.openLetterByNodeId(nodeId);
        return await this.getMessageInfo();
    }

}

module.exports = GmailPuppeteerHandler;