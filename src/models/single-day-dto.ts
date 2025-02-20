
export interface SingleDateDto {
  code: number
  status: string
  data: {
    timings: {
      Fajr: string
      Sunrise: string
      Dhuhr: string
      Asr: string
      Sunset: string
      Maghrib: string
      Isha: string
      Imsak: string
      Midnight: string
      Firstthird: string
      Lastthird: string
    }
    date: {
      readable: string
      timestamp: string
      hijri: {
        date: string
        format: string
        day: string
        weekday: {
          en: string
          ar: string
        }
        month: {
          number: number
          en: string
          ar: string
          days: number
        }
        year: string
        designation: {
          abbreviated: string
          expanded: string
        }
        holidays: [any]
        adjustedHolidays: [string]
        method: string
      }
      gregorian: {
        date: string
        format: string
        day: string
        weekday: {
          en: string
        }
        month: {
          number: number
          en: string
        }
        year: string
        designation: {
          abbreviated: string
          expanded: string
        }
        lunarSighting: boolean
      }
    }
    meta: {
      latitude: number
      longitude: number
      timezone: string
      method: {
        id: number
        name: string
        params: {
          Fajr: number
          Isha: number
        }
        location: {
          latitude: number
          longitude: number
        }
      }
      latitudeAdjustmentMethod: string
      midnightMode: string
      school: string
      offset: {
        Imsak: number
        Fajr: number
        Sunrise: number
        Dhuhr: number
        Asr: number
        Sunset: number
        Maghrib: number
        Isha: number
        Midnight: number
      }
    }
  }
}