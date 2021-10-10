function allowUserBotting(client, node_modules_path = '../') {

    client.ws.connect = async function () {
        const WebSocketShardClass = await import(node_modules_path + 'discord.js/src/client/websocket/WebSocketShard.js');
        const WebSocketShard = WebSocketShardClass.default;

        const { url: gatewayURL } = await this.client.api.gateway.get().catch(error => {
            throw error.httpStatus === 401 ? new Error('Invalid token') : error;
        });
        this.sessionStartLimit = 1;
        this.gateway = `${gatewayURL}/`;
        let { shards } = this.client.options;
        this.totalShards = shards.length;
        this.shardQueue = new Set(shards.map(id => new WebSocketShard(client.ws, id)));
        return this.createShards();
    }
}

module.exports = allowUserBotting;
