import Connection from "node-imap";
import * as Imap from "node-imap";
import { XOAuth2 } from "xoauth2";
import * as secret from "./secret.json";

export class getMail{
    public user_email : string = "";
    public user_pwd : string = "";
    public imapHost : string = "imap.gmail.com";
    public imapPort : number = 993;
    public imapTLS : boolean = true;
    public authTimeout : number = 3000;

    //how to make that shit work.... ?? 
    public XOAuth2: any = XOAuth2.createXOAuth2Generator({
        user: this.user_email,
        clientId: secret.web.client_id,
        clientSecret: secret.web.client_secret,
        //refreshToken: "your-refresh-token"
    })

    public imap = new Imap(
        {
            user: this.user_email,
            xoauth2: XOAuth2,
            password: this.user_pwd,
            host: "imap.gmail.com",
            port: 993,
            tls: true,
            authTimeout: this.authTimeout
        }
    );

    public email_array : Array<string> = new Array<string>;
    public buffer = '';


    constructor(email, pwd, host?, port?, tls?, authTimeout?){
        if(email&&pwd){
            this.user_email=email;
            this.user_pwd=pwd;
        }
        if (host){
            this.imapHost=host;
            this.imapPort=port;
            this.imapTLS=tls;
            this.authTimeout=authTimeout;
        }
    }

    public openInbox(cb): void {
        // openReadOnly = false
        this.imap.openBox('Inbox', false, cb);
    }

    public execute() {
        this.imap.once('ready', function () {
        this.openInbox(function (err: Error, box: Connection.Box) {
                if (err) throw err;
                var f = this.imap.seq.fetch('1:1', {
                    bodies: '1',
                    struct: true
                });
                f.on('message', function (msg, seqno) {
                    console.log('Message #%d', seqno);
                    msg.on('body', function (stream, info) {
                        stream.on('data', function (chunk) {
                            this.buffer = chunk.toString('utf8');
                            this.email_array.push(this.buffer);
                            console.log("buffer", this.buffer)
                        });
                    });
                    msg.once('end', function () {
                        console.log('Finished');
                    });
                });
            });
        });
        this.imap.once('error', function (err) {
            console.log(err);
        });
        this.imap.connect();
        return new Promise <Array<string>> ((resolve, reject) => {
            this.imap.once('end', async function () {
                resolve(this.email_array);
            });
        })
    }
    
}

