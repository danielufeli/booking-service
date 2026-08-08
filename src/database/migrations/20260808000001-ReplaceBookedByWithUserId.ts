import type { MigrationInterface, QueryRunner } from "typeorm";

export class ReplaceBookedByWithUserId20260808000001 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking_service"."bookings" DROP COLUMN "booked_by"`
    );
    await queryRunner.query(
      `ALTER TABLE "booking_service"."bookings" ADD COLUMN "user_id" integer NOT NULL`
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking_service"."bookings" DROP COLUMN "user_id"`
    );
    await queryRunner.query(
      `ALTER TABLE "booking_service"."bookings" ADD COLUMN "booked_by" varchar`
    );
  }
}