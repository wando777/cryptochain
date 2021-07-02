const redis = require('redis');

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
}

class PubSub {
    constructor({ blockchain }) {
        this.blockchain = blockchain;

        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();

        this.subscriberToChannels();

        // this.subscriber.subscribe(CHANNELS.TEST);
        // this.subscriber.subscribe(CHANNELS.BLOCKCHAIN);

        this.subscriber.on('message',
            (channel, message) => this.handleMessage(channel, message)
        );
    }

    handleMessage(channel, message) {
        console.log(`Mssage received. Channel: ${channel}. Message: ${message}.`);

        const parsedMessage = JSON.parse(message);
        if (channel == CHANNELS.BLOCKCHAIN) {
            this.blockchain.replaceChain(parsedMessage);
        }
    }

    subscriberToChannels() {
        Object.values(CHANNELS).forEach(channel => {
            this.subscriber.subscribe(channel);
        })
    };

    publish({ channel, message }) {
        this.publisher.publish(channel, message);
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        })
    }

}

module.exports = PubSub;

// const testPubSub = new PubSub();
// setTimeout(() => testPubSub.publisher.publish(CHANNELS.TEST, 'foo-string'), 1000);