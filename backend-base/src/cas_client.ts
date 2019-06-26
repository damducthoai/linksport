import * as cassandra from 'cassandra-driver';

export class CassandraClient {

    public static getInstance(config: any){
        if(this.instance == null){
            this.instance = new CassandraClient(config);
        }
        return this.instance;
    };

    private static instance: CassandraClient;

    private readonly client: cassandra.Client;

    private constructor(config: any) {
        const PlainTextAuthProvider = cassandra.auth.PlainTextAuthProvider;

        const option = {
            ...config.option,
            authProvider: new PlainTextAuthProvider(config.authProvider.username, config.authProvider.password)
        }
         this.client = new cassandra.Client(option);
    }
    public getClient(): cassandra.Client {
        return this.client;
    }
}