import * as cassandra from "cassandra-driver";
import {CassandraClient} from "./cas_client";
import {Task} from "./task";

export abstract class CassandraTask extends Task {

    protected getClient(): cassandra.Client{
        return CassandraClient.getInstance(this.globalConfig.cassandra).getClient();
    }
}