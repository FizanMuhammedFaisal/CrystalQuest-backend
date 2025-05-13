import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1747135157639 implements MigrationInterface {
    name = 'InitialSchema1747135157639'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "created_at" TO "createdAt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "createdAt" TO "created_at"`);
    }

}
