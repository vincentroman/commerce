import { CronJob } from "cron";
import { MailTemplateDao } from "../dao/MailTemplateDao";
import { Container } from "typedi";
import { SystemSettingDao } from "../dao/SystemSettingDao";
import { MailTemplateType, MailTemplate } from "../entity/MailTemplate";
import { SystemSettingId } from "../entity/SystemSetting";
import { Email, Address } from "./Email";
import { NotificationBacklogItemDao } from "../dao/NotificationBacklogItemDao";
import { NotificationType, NotificationBacklogItem } from "../entity/NotificationBacklogItem";
import { ProductDao } from "../dao/ProductDao";
import { Product } from "../entity/Product";

export class ScheduledTasks {
    private static SCHEDULED: boolean = false;

    public static init(): void {
        if (ScheduledTasks.SCHEDULED) {
            throw new Error("Scheduled tasks have already been initialized - can only be called once.");
        }
        console.log("Initializing scheduled tasks...");
        ScheduledTasks.SCHEDULED = true;
        try {
            // Run cron every 8 hours at */8:15:00
            new CronJob("0 15 */8 * * *", ScheduledTasks.sendLicenseExpirationReminders).start();
            new CronJob("0 25 */8 * * *", ScheduledTasks.sendEvalBuyReminders).start();
        } catch (e) {
            console.error(e);
        }
    }

    public static async sendLicenseExpirationReminders(): Promise<void> {
        console.log("Checking if we need to send license expiration reminders...");
        let dao: NotificationBacklogItemDao = Container.get(NotificationBacklogItemDao);
        let template: MailTemplate = await Container.get(MailTemplateDao).getByType(MailTemplateType.LicenseExpiryReminder);
        let siteUrl: string = await Container.get(SystemSettingDao).getString(SystemSettingId.Site_Url, "");
        let notificationItems: NotificationBacklogItem[] = await dao.getItemsDueToday(NotificationType.REMIND_EXPIRY);
        for (let notificationItem of notificationItems) {
            let payload = notificationItem.getPayload();
            let product: Product = await Container.get(ProductDao).getById(payload.productId);
            let recipient: Address = {
                email: notificationItem.person.email
            };
            let params = {
                firstname: notificationItem.person.firstname,
                lastname: notificationItem.person.lastname,
                siteUrl: siteUrl,
                daysRemaining: payload.daysRemaining,
                product: product.title
            };
            console.log("Sending license expiration reminder for product %s to customer %s", product.title, notificationItem.person.email);
            await Email.sendByTemplate(template, recipient, params);
            await dao.delete(notificationItem);
        }
    }

    private static async sendEvalBuyReminders(): Promise<void> {
        console.log("Checking if we need to send eval buy reminders...");
        let dao: NotificationBacklogItemDao = Container.get(NotificationBacklogItemDao);
        let template: MailTemplate = await Container.get(MailTemplateDao).getByType(MailTemplateType.LicenseExpiryReminder);
        let siteUrl: string = await Container.get(SystemSettingDao).getString(SystemSettingId.Site_Url, "");
        let notificationItems: NotificationBacklogItem[] = await dao.getItemsDueToday(NotificationType.REMIND_EVAL_BUY);
        for (let notificationItem of notificationItems) {
            let payload = notificationItem.getPayload();
            let product: Product = await Container.get(ProductDao).getById(payload.productId);
            let recipient: Address = {
                email: notificationItem.person.email
            };
            let params = {
                firstname: notificationItem.person.firstname,
                lastname: notificationItem.person.lastname,
                siteUrl: siteUrl,
                product: product.title
            };
            console.log("Sending eval buy reminder for product %s to customer %s", product.title, notificationItem.person.email);
            await Email.sendByTemplate(template, recipient, params);
            await dao.delete(notificationItem);
        }
    }
}
