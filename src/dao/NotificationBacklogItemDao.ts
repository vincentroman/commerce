import { Repository } from "typeorm";
import { Service } from "typedi";
import { Dao } from "./Dao";
import { NotificationBacklogItem, NotificationType } from "../entity/NotificationBacklogItem";
import * as moment from "moment";
import { LicenseKey } from "../entity/LicenseKey";
import { ProductVariantType } from "../entity/ProductVariant";
import { Config } from "../util/Config";

@Service()
export class NotificationBacklogItemDao extends Dao<NotificationBacklogItem> {
    protected getRepository(): Repository<NotificationBacklogItem> {
        return this.getEm().getRepository(NotificationBacklogItem);
    }

    protected allowPhysicalDelete(o: NotificationBacklogItem): Promise<boolean> {
        return new Promise((resolve, reject) => resolve(true));
    }

    public async getItemsDueToday(type: NotificationType): Promise<NotificationBacklogItem[]> {
        let today: string = moment()
            .hours(23).minutes(59).seconds(59)
            .format("YYYY-MM-DD HH:mm:ss");
        return this.getRepository()
            .createQueryBuilder("nbi")
            .innerJoinAndSelect("nbi.person", "person")
            .where("nbi.deleted != 1")
            .andWhere("nbi.type = :type", {type: type})
            .andWhere(this.getDateComparisonString("nbi.dueDate", ":date"), {date: today})
            .orderBy("nbi.dueDate", "ASC")
            .getMany();
    }

    public async createLicenseKeyItems(licenseKey: LicenseKey): Promise<void> {
        await this.createLicenseExpiryReminderItems(licenseKey);
        await this.createEvalBuyItem(licenseKey);
    }

    private async createLicenseExpiryReminderItems(licenseKey: LicenseKey): Promise<void> {
        if (!(licenseKey.productVariant.type === ProductVariantType.TrialLicense ||
            licenseKey.productVariant.type === ProductVariantType.LifetimeLicense ||
            licenseKey.productVariant.type === ProductVariantType.LimitedLicense)) {
            return;
        }
        let daysRemainingList: number[] = this.getExpiryDaysRemainingList(licenseKey);
        for (let daysRemaining of daysRemainingList) {
            let item: NotificationBacklogItem = new NotificationBacklogItem();
            item.type = NotificationType.REMIND_EXPIRY;
            item.person = licenseKey.customer;
            item.dueDate = moment(licenseKey.expiryDate).subtract(daysRemaining, "days").toDate();
            item.setPayload({
                licenseKeyId: licenseKey.id,
                productId: licenseKey.productVariant.product.id,
                daysRemaining: daysRemaining
            });
            await this.save(item);
        }
    }

    private async createEvalBuyItem(licenseKey: LicenseKey): Promise<void> {
        if (!(licenseKey.productVariant.type === ProductVariantType.TrialLicense ||
            licenseKey.productVariant.type === ProductVariantType.Eval)) {
            return;
        }
        let daysRemainingList: number[] = this.getExpiryDaysRemainingList(licenseKey);
        let item: NotificationBacklogItem = new NotificationBacklogItem();
        item.type = NotificationType.REMIND_EVAL_BUY;
        item.person = licenseKey.customer;
        item.dueDate = moment().add(7, "days").toDate();
        item.setPayload({
            licenseKeyId: licenseKey.id,
            productId: licenseKey.productVariant.product.id
        });
        await this.save(item);
    }

    private getExpiryDaysRemainingList(licenseKey: LicenseKey): number[] {
        if (licenseKey.productVariant.type === ProductVariantType.LifetimeLicense ||
            licenseKey.productVariant.type === ProductVariantType.LimitedLicense) {
                return [30, 7, 1];
        } else if (licenseKey.productVariant.type === ProductVariantType.TrialLicense) {
            return [7, 1];
        } else {
            return [];
        }
    }
}
