#!/usr/bin/env ts-node-script
import 'reflect-metadata';
import { Application, KernelModule } from '@deepkit/framework';
import { arg, cli, Command } from '@deepkit/app';
import { entity, t } from '@deepkit/type';
import { Database } from '@deepkit/orm';
import { SQLiteDatabaseAdapter } from '@deepkit/sqlite';

@entity.name('user')
class User {
    @t.primary.autoIncrement id: number = 0;

    @t created: Date = new Date;

    constructor(@t public username: string) {
    }
}


export class SQLiteDatabase extends Database {
    name = 'default';
    constructor() {
        super(new SQLiteDatabaseAdapter('app.sqlite'), [User]);
    }
}

@cli.controller('add-user')
export class TestCommand implements Command {
    constructor(protected database: SQLiteDatabase) {
    }

    async execute(
        @arg username: string
    ) {
        const user = new User(username);
        await this.database.persist(user);
        console.log('User added with id', user.id);
    }
}

Application.create({
    controllers: [TestCommand],
    imports: [
        KernelModule.configure({
            databases: [SQLiteDatabase],
            migrateOnStartup: true,
            debug: true,
        })
    ]
}).run();
