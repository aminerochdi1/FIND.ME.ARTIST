export default class TimeUtils {

    public static getPostDuration(translate: any, publishedAt: Date) {
        const currentTime = new Date();
        const publishedTime = new Date(publishedAt);

        const timeDiff = Math.abs(currentTime.getTime() - publishedTime.getTime());
        const months = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 30));
        const weeks = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7));
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

        let duration = '';

        if (months > 0) 
          return `${months} `+translate("month")+`(s) `;

          if (weeks > 0) 
            return `${weeks} `+translate("week")+`(s) `;

        if (days > 0) 
            return `${days} `+translate("day")+`(s) `;

        if (hours > 0) 
            return `${hours} `+translate("hour")+`(s) `;

        if (minutes > 0) 
            return `${minutes} `+translate("minutes")+`(s) `;

        if (duration === '') 
            return translate("less_than_a_minute");
    }
} 