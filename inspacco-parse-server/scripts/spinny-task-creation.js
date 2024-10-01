

const getSaveOrQueryOption = (user) => {
    let option = user && !user.useMasterKey
      ? { sessionToken: user.getSessionToken() }
      : { useMasterKey: true };
    return option;
  };
  const getSchemaQuery = (schemaname) => {
    return (queryObj, user) => {
      let query = getQuery(schemaname);
      Object.keys(queryObj).forEach((field) => {
        query.equalTo(field, queryObj[field]);
      });
      return query.first(getSaveOrQueryOption(user));
    };
  };
  const getSchemaFindQuery = (schemaname) => {
    return (queryObj, user) => {
      let query = getQuery(schemaname);
      Object.keys(queryObj).forEach((field) => {
        query.equalTo(field, queryObj[field]);
      });
      return query.find(getSaveOrQueryOption(user));
    };
  };
  function createRecord(schemaname) {
    return (obj, user) => {
      const Schema = Parse.Object.extend(schemaname);
      const schema = new Schema();
      return schema.save(obj, getSaveOrQueryOption(user));
    };
  }
  const getQuery = (schemaname) => {
    const Schema = Parse.Object.extend(schemaname);
    return new Parse.Query(Schema);
  };
  

const data = [
    {
      "Client Name": "Spinny Mantri Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "9 Feb 2023",
      "End Date": "9 Feb 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1DJfoe7z_S72g0ORHV4_5lfPVJ-_8e6mL/view"
    },
    {
      "Client Name": "Spinny Mantri Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "13 Jan 2023",
      "End Date": "13 Jan 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1Z1XbjWoK2l6x_PbtSsHzsUfio2hcRfL7/view"
    },
    {
      "Client Name": "Spinny Mantri Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "26 Jan 2023",
      "End Date": "26 Jan 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1d8U7VdcDknkGudGNWxh-UCLZm8IR0sSF/view"
    },
    {
      "Client Name": "Spinny Mantri Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "11 Nov 2022",
      "End Date": "11 Nov 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1TTB3ZyOR4-L6dMhV-LTfHQ9ImNykthPz/view"
    },
    {
      "Client Name": "Spinny Mantri Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "26 Oct 2022",
      "End Date": "26 Oct 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1hq9hKOhck3SomcJdrf6zXGJXbn6nHNlN/view"
    },
    {
      "Client Name": "Spinny Truebil Mantri Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "3 Feb 2023",
      "End Date": "3 Feb 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1YMq8bM5R-9zpMLprfnPZGN7HOVz5NyET/view"
    },
    {
      "Client Name": "Spinny Truebil Mantri Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "10 Feb 2023",
      "End Date": "10 Feb 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1pExeEGE0vBz_93FxMqzNQ8PHlyma1eW6/view"
    },
    {
      "Client Name": "Spinny Truebil Mantri Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "17 Feb 2023",
      "End Date": "17 Feb 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1VRxkLrZsNxikYBd1NhJuUQhTN8gC27YA/view"
    },
    {
      "Client Name": "Spinny Truebil Mantri Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "24 Feb 2023",
      "End Date": "24 Feb 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1kMkGugvM_ItP-sfNd3FReMH_uTufJLGL/view"
    },
    {
      "Client Name": "Spinny Truebil Mantri Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "3 Jan 2023",
      "End Date": "3 Jan 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1W6Chl8GeBYtfIMKm95fgXsB3dTGuackw/view"
    },
    {
      "Client Name": "Spinny Truebil Mantri Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "20 Jan 2023",
      "End Date": "20 Jan 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1SQbX7QoC4wL20PvfH-EaBWFNdR1idQX4/view"
    },
    {
      "Client Name": "Spinny Truebil Mantri Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "27 Jan 2023",
      "End Date": "27 Jan 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1xdqFlXTObwAG4ROWVi5wJ9pxopDmO9yx/view"
    },
    {
      "Client Name": "Spinny Truebil Mantri Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "7 Nov 2022",
      "End Date": "7 Nov 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1sai11wwlTQfq9xnfy4sCJgJueCAluREF/view"
    },
    {
      "Client Name": "Spinny Truebil Mantri Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "17 Nov 2022",
      "End Date": "17 Nov 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1sV0Mlobeee0ZdNacnlzRpaymhNwO0LwP/view"
    },
    {
      "Client Name": "Spinny Truebil Mantri Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "29 Nov 2022",
      "End Date": "29 Nov 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1a8yExTYRFfg4hZRlgPO72dua1z7UYK-d/view"
    },
    {
      "Client Name": "Spinny Truebil Mantri Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "11 Oct 2022",
      "End Date": "11 Oct 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1UuYmAbaMZbA5v1rzPMD2yv8pvbR_OvLl/view"
    },
    {
      "Client Name": "Spinny Truebil Mantri Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "25 Oct 2022",
      "End Date": "25 Oct 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1Oa2qK-uPUBjXHmzxsEt8HlkJPN_5AC5V/view"
    },
    {
      "Client Name": "Spinny Royal Meenakshi Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "5 Jan 2023",
      "End Date": "5 Jan 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1f_WHoe93ZIFkJM3C9KJPrV16Tz2ThHiA/view"
    },
    {
      "Client Name": "Spinny Royal Meenakshi Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "19 Jan 2023",
      "End Date": "19 Jan 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1JoQ4NHTKoi7Nf0_OfAdDHeD8XG8Th44Y/view"
    },
    {
      "Client Name": "Spinny Royal Meenakshi Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "25 Jan 2023",
      "End Date": "25 Jan 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1dsRO5eD34hZq73t0z4KpeI71dtfXbSEF/view"
    },
    {
      "Client Name": "Spinny Royal Meenakshi Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "6 Oct 2022",
      "End Date": "6 Oct 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1jipQ7tP7iz9NP755WttBV3Fjl3pIwWjY/view"
    },
    {
      "Client Name": "Spinny Royal Meenakshi Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "14 Oct 2022",
      "End Date": "14 Oct 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1dwCmyVtinwtMjeS00_PAwfi117v7E74K/view"
    },
    {
      "Client Name": "Spinny Royal Meenakshi Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "1 Feb 2023",
      "End Date": "1 Feb 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1fcm2YP6MTndyw5pOQ39FP5eGTKDgeOau/view"
    },
    {
      "Client Name": "Spinny Royal Meenakshi Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "8 Feb 2023",
      "End Date": "8 Feb 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/open?id=1fnTlZkAGL0xMb0pdeeTrF0451ywzAw4z&authuser=0"
    },
    {
      "Client Name": "Spinny Royal Meenakshi Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "15 Feb 2023",
      "End Date": "15 Feb 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1yaKcxBD_UCNjvsPg2xrYRSjYcVwIfP3U/view"
    },
    {
      "Client Name": "Spinny Royal Meenakshi Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "22 Feb 2023",
      "End Date": "22 Feb 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/16tlg0twg5ShG_ihwqN-CSLa_IoUxFKOz/view"
    },
    {
      "Client Name": "Spinny Royal Meenakshi Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "23 Feb 2023",
      "End Date": "23 Feb 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1iOPj4L8drWxgKdoDSHQv35XDJq_XaDVq/view"
    },
    {
      "Client Name": "Spinny Vega City",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "6 Feb 2023",
      "End Date": "6 Feb 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1rbunfkH4T2Usy_lapU_RuaVs75GfkYgW/view"
    },
    {
      "Client Name": "Spinny Vega City",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "14 Feb 2023",
      "End Date": "14 Feb 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1hMENWdPWfNtn2mWHBHrFhhKhmITKKpMO/view"
    },
    {
      "Client Name": "Spinny Vega City",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "20 Feb 2023",
      "End Date": "20 Feb 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1FQ81fYdAcgpAx0qjeqDwdhN-atNf7edQ/view"
    },
    {
      "Client Name": "Spinny Vega City",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "2 Jan 2023",
      "End Date": "2 Jan 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1c7fX5HmElZgdumm6l4TnIJSCP_Zi2T8E/view"
    },
    {
      "Client Name": "Spinny Vega City",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "11 Jan 2023",
      "End Date": "11 Jan 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1dsRO5eD34hZq73t0z4KpeI71dtfXbSEF/view"
    },
    {
      "Client Name": "Spinny Vega City",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "24 Jan 2023",
      "End Date": "24 Jan 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1X3ghSNjfhsdn-qFgTz_nsmimIoTJ0vqz/view"
    },
    {
      "Client Name": "Spinny Vega City",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "30 Jan 2023",
      "End Date": "30 Jan 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1Ad2-dPmzDcxbZiyYx5Io13HyZCRKrInA/view"
    },
    {
      "Client Name": "Spinny Vega City",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "7 Nov 2022",
      "End Date": "7 Nov 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1n7Eu1a9ghA8KBAAntEp5mAfvVNe4uYhx/view"
    },
    {
      "Client Name": "Spinny Vega City",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "21 Nov 2022",
      "End Date": "21 Nov 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1eF6DzrbWArbWbpvQSLhfyEOHi4g-QgFy/view"
    },
    {
      "Client Name": "Spinny Vega City",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "13 Oct 2022",
      "End Date": "13 Oct 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1s2kBgGwxiO3RsUZhJhTy02l79kThLobf/view"
    },
    {
      "Client Name": "Spinny Vega City",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "27 Oct 2022",
      "End Date": "27 Oct 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1oVKwqJ_WNEjWnClBVppf7rHPNgDTDrC8/view"
    },
    {
      "Client Name": "Spinny VR Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "16 Feb 2023",
      "End Date": "16 Feb 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1c-xwzJR8JrhaS9nRjAxZJfWd_CKDFc7K/view"
    },
    {
      "Client Name": "Spinny VR Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "16 Jan 2023",
      "End Date": "16 Jan 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1bOT1W-XLyreblp3TUcXVDU1wlkpkKfpE/view"
    },
    {
      "Client Name": "Spinny VR Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "31 Jan 2023",
      "End Date": "31 Jan 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/18BJ2vGjALPIS1hH_lP-uWuoqBl_BQyxU/view"
    },
    {
      "Client Name": "Spinny VR Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "8 Nov 2022",
      "End Date": "8 Nov 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1zCHijC6qaaGeHyTqXlcTJk3snAN0qVFE/view"
    },
    {
      "Client Name": "Spinny VR Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "10 Nov 2022",
      "End Date": "10 Nov 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1f1FhBjRkT5vJdmfw03_y8wj_vWxKbi4K/view"
    },
    {
      "Client Name": "Spinny VR Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "13 Oct 2022",
      "End Date": "13 Oct 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1ukqP0R47cyufSPn9UcfkOgH95ojgO1BF/view"
    },
    {
      "Client Name": "Spinny VR Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "30 Oct 2022",
      "End Date": "30 Oct 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1wYUvFpsWKznd0kvK6FKdSr9GWt5BVv0r/view"
    },
    {
      "Client Name": "Spinny Grand Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "7 Feb 2023",
      "End Date": "7 Feb 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1QQ9WGdFyD3xt-mU8Pb4ilhBafD_DgF7j/view"
    },
    {
      "Client Name": "Spinny Grand Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "10 Jan 2023",
      "End Date": "10 Jan 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1JFuQJL8b32vHpMORH5w_-lUwFXCdlxQe/view"
    },
    {
      "Client Name": "Spinny Grand Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "31 Jan 2023",
      "End Date": "31 Jan 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1xs1XBxNoQGTSoA-kgr6zNhTtHv2KDpIH/view"
    },
    {
      "Client Name": "Spinny Grand Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "29 Dec 2022",
      "End Date": "29 Dec 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/13Qx92QHVYb1ct7xhsny0_g1FUtYRQwsT/view"
    },
    {
      "Client Name": "Spinny Grand Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "11 Nov 2022",
      "End Date": "11 Nov 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1Fp_n2DGGy_34LBMmivd6IY184oolCjAb/view"
    },
    {
      "Client Name": "Spinny Grand Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "18 Oct 2022",
      "End Date": "18 Oct 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1ac4fdU2PEP1cGv3aqzVhTY4-8D4Syq-o/view"
    },
    {
      "Client Name": "Spinny Grand Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "29 Oct 2022",
      "End Date": "29 Oct 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1kkvbpTe18e9HJVjNwk-qFHKWqywygpJN/view"
    },
    {
      "Client Name": "Spinny Universal Trade Tower",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "7 Feb 2023",
      "End Date": "7 Feb 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1RThlV3ufB3YO3AdVT94wjXZwe-KCEF3Z/view"
    },
    {
      "Client Name": "Spinny Universal Trade Tower",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "28 Feb 2023",
      "End Date": "28 Feb 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1t5QgI16CBLNdcb8nTL9Z2Rxhc7DNL0TV/view"
    },
    {
      "Client Name": "Spinny Universal Trade Tower",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "10 Jan 2023",
      "End Date": "10 Jan 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/14HD24UEyQ8Ajd79SlM8CGB0Mch4Rqo9o/view"
    },
    {
      "Client Name": "Spinny Universal Trade Tower",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "31 Jan 2023",
      "End Date": "31 Jan 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1F0LxGb5O9ZwN6pkSF1V8YnTjuIteXdUO/view"
    },
    {
      "Client Name": "Spinny Universal Trade Tower",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "29 Dec 2022",
      "End Date": "29 Dec 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1T0-mYbHyAbQRfrjscgtojhYq0focD7z9/view"
    },
    {
      "Client Name": "Spinny Universal Trade Tower",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "11 Nov 2022",
      "End Date": "11 Nov 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1b02cD26fuR6WHZeLdHIfRHxsF_M7gAMK/view"
    },
    {
      "Client Name": "Spinny Universal Trade Tower",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "18 Oct 2022",
      "End Date": "18 Oct 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/15OC-vMbA1vMHUMEXdVBq0gyQbUQb_Nr7/view"
    },
    {
      "Client Name": "Spinny Universal Trade Tower",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "29 Oct 2022",
      "End Date": "29 Oct 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1x2JITo06NKYCWAdohDmfVLbtbFF3THVc/view"
    },
    {
      "Client Name": "Spinny Truebil",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "1 Feb 2023",
      "End Date": "1 Feb 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1aYxiyNj3hkd0Wy7i6MpAuZ9Km7aiVjDB/view"
    },
    {
      "Client Name": "Spinny Truebil",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "23 Jan 2023",
      "End Date": "23 Jan 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1KKt1zcTiHd1zKzEZv9dp9l-BNBRMenLc/view"
    },
    {
      "Client Name": "Spinny Truebil",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "9 Nov 2022",
      "End Date": "9 Nov 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1Ac_MK-hNqgowlid9fOwV9TUZHBVz6fRa/view"
    },
    {
      "Client Name": "Spinny Truebil",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "11 Oct 2022",
      "End Date": "11 Oct 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1cndZwl2AfmSShwZtoCBlMSBHD0i-ilmn/view"
    },
    {
      "Client Name": "Spinny Korum Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "16 Feb 2023",
      "End Date": "16 Feb 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1v9jPYTMZNuej089KoQx6QRH7e_owgeld/view"
    },
    {
      "Client Name": "Spinny Korum Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "23 Feb 2023",
      "End Date": "23 Feb 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/11EHAntA9AaZSVES7JkVz5ltqo68R5M70/view"
    },
    {
      "Client Name": "Spinny Korum Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "16 Jan 2023",
      "End Date": "16 Jan 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/13_OOTE9vV6rOW1JMIj-LN49ByGVRUI3M/view"
    },
    {
      "Client Name": "Spinny Korum Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "29 Jan 2023",
      "End Date": "29 Jan 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1jbPZ8FIbCHsgi1wUR5BZCOvj5e__8EPO/view"
    },
    {
      "Client Name": "Spinny Korum Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "12 Dec 2022",
      "End Date": "12 Dec 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1o7AVhrJzBuYC5enm9WBNoIlRbH9ayJqp/view"
    },
    {
      "Client Name": "Spinny Korum Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "26 Dec 2022",
      "End Date": "26 Dec 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1XgScejJLkgzR8o2Hht1l89phiufqFGVR/view"
    },
    {
      "Client Name": "Spinny Korum Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "16 Nov 2022",
      "End Date": "16 Nov 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1Uuv2MOMgBM7-ym94Zma4h_pDhlMoABr3/view"
    },
    {
      "Client Name": "Spinny Korum Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "25 Nov 2022",
      "End Date": "25 Nov 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1r50L4-wPymtHnQLLiEipGLcBNuPw5RKT/view"
    },
    {
      "Client Name": "Spinny Korum Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "13 Oct 2022",
      "End Date": "13 Oct 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1dwqD8fM2RHtj6hxwmWxOWcdumZxwX3Qm/view"
    },
    {
      "Client Name": "Spinny Korum Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "27 Oct 2022",
      "End Date": "27 Oct 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1fx9WGnZYxRTtYQ46qnOMwqWQarUa3QZ7/view"
    },
    {
      "Client Name": "Spinny Truebil Borivali West",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "3 Feb 2023",
      "End Date": "3 Feb 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1BrchvJanvyvjRFHVZniD1FzbCUQQUqMV/view"
    },
    {
      "Client Name": "Spinny Truebil Borivali West",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "13 Feb 2023",
      "End Date": "13 Feb 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1vAQNdlCSPDVAHFQl5F_MrxdbSfNyK_lw/view"
    },
    {
      "Client Name": "Spinny Truebil Borivali West",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "24 Feb 2023",
      "End Date": "24 Feb 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1lplE9ou1Mk8lWiK24TRKqBurc37tJkiw/view"
    },
    {
      "Client Name": "Spinny Truebil Borivali West",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "27 Feb 2023",
      "End Date": "27 Feb 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1OF1Q5fFoqfCKQo_8mYILfUzcpYurm7gQ/view"
    },
    {
      "Client Name": "Spinny Truebil Borivali West",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "6 Jan 2023",
      "End Date": "6 Jan 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1asQC5V7p9GN1IdojCBdlPHaawCLxYYKp/view"
    },
    {
      "Client Name": "Spinny Truebil Borivali West",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "11 Jan 2023",
      "End Date": "11 Jan 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1uTVY36CIpRRTXEbXOjfw361Ae0_AhlzV/view"
    },
    {
      "Client Name": "Spinny Truebil Borivali West",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "23 Jan 2023",
      "End Date": "23 Jan 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1ukm-1wgIQiMCBEnjpOJ4FndrPcxfqY8G/view"
    },
    {
      "Client Name": "Spinny Truebil Borivali West",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "27 Jan 2023",
      "End Date": "27 Jan 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1vpN5v6_CQgJ4Q5vCpvQo-CRz8DhZ5Txk/view"
    },
    {
      "Client Name": "Spinny Truebil Borivali West",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "9 Dec 2022",
      "End Date": "9 Dec 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1kYLSQl6xjqoNldnIPvpMgNlhFXetnuWg/view"
    },
    {
      "Client Name": "Spinny Truebil Borivali West",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "19 Dec 2022",
      "End Date": "19 Dec 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/18Ayqea_xL5ZnveGdrkNJROBh6pKKILvY/view"
    },
    {
      "Client Name": "Spinny Truebil Borivali West",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "24 Dec 2022",
      "End Date": "24 Dec 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1g4XgaAIJ-EcF4VlhDSIXWYNOogdKOv8S/view"
    },
    {
      "Client Name": "Spinny Truebil Borivali West",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "29 Dec 2022",
      "End Date": "29 Dec 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1RcaDPvpm2al3sej6R9w8kf6Wek1p91RW/view"
    },
    {
      "Client Name": "Spinny Truebil Borivali West",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "4 Nov 2022",
      "End Date": "4 Nov 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1wLhkFDs8XaY7FHUzd66h_QMlRPnNLAW_/view"
    },
    {
      "Client Name": "Spinny Truebil Borivali West",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "16 Nov 2022",
      "End Date": "16 Nov 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1FY_zwXTocVAZurs2HtcqrMo9n6MuNGrH/view"
    },
    {
      "Client Name": "Spinny Truebil Borivali West",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "25 Nov 2022",
      "End Date": "25 Nov 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1buHvU-4PJf3D3O-GY6eQRB3UAyXUvIsH/view"
    },
    {
      "Client Name": "Spinny Truebil Borivali West",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "28 Nov 2022",
      "End Date": "28 Nov 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/13ll7WVkKxSQQDgJrVeUNnO0-IBsfU_ct/view"
    },
    {
      "Client Name": "Spinny Truebil Borivali West",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "6 Oct 2022",
      "End Date": "6 Oct 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1EuUNb4GUgHWsUm2QLfqrzt2fgjtlLMpV/view"
    },
    {
      "Client Name": "Spinny Truebil Borivali West",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "12 Oct 2022",
      "End Date": "12 Oct 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1gGWKdcZvJ8DitbN1wsNCWfxgd8tSJlXz/view"
    },
    {
      "Client Name": "Spinny Truebil Borivali West",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "21 Oct 2022",
      "End Date": "21 Oct 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/11kB28YKNQcAL8Uk3vyiUZt4pqKmevXVG/view"
    },
    {
      "Client Name": "Spinny Truebil Borivali West",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "27 Oct 2022",
      "End Date": "27 Oct 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1xp3elult-tJIoLOYka7zfhLwS2LtvZvm/view"
    },
    {
      "Client Name": "Spinny Elpro City Square Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "14 Feb 2023",
      "End Date": "14 Feb 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1S2jXnE2JzjvZnb3x56DO7iNUMqAmHwwq/view"
    },
    {
      "Client Name": "Spinny Elpro City Square Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "28 Feb 2023",
      "End Date": "28 Feb 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1Kh-v69CkHljVMh0rYZDVvuXCqf9Jkdm0/view"
    },
    {
      "Client Name": "Spinny Elpro City Square Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "28 Jan 2023",
      "End Date": "28 Jan 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/16SPcc20MpJwLTdvUeEAqnDsRTKFrYNS0/view"
    },
    {
      "Client Name": "Spinny Elpro City Square Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "13 Dec 2022",
      "End Date": "13 Dec 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/13DXR6grhBD6wOasLIkYXPxEmo_xUfEkn/view"
    },
    {
      "Client Name": "Spinny Elpro City Square Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "27 Dec 2022",
      "End Date": "27 Dec 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1iB9cB9qhg_oI_B2oOpxT6Bh5MAMA6HWw/view"
    },
    {
      "Client Name": "Spinny Elpro City Square Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "16 Nov 2022",
      "End Date": "16 Nov 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1npM11SHTiqTBKdXTpw1ODghQbPOZSSem/view"
    },
    {
      "Client Name": "Spinny Elpro City Square Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "24 Nov 2022",
      "End Date": "24 Nov 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1rhoFlJTWnHR1ehYVE2BgaG1gJRx7SiZC/view"
    },
    {
      "Client Name": "Spinny Elpro City Square Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "28 Oct 2022",
      "End Date": "28 Oct 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1B_NM3kFVe_3-LDUSUJjxRzHN8U5Clbdj/view"
    },
    {
      "Client Name": "Spinny Vision One Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "6 Feb 2023",
      "End Date": "6 Feb 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1tytpCuhO-N2B8pTS5WLaR-R_sJjtpmN_/view"
    },
    {
      "Client Name": "Spinny Vision One Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "13 Feb 2023",
      "End Date": "13 Feb 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1orOdwgpfMmr9YrTWeyMU_3qOcQz-V1-Z/view"
    },
    {
      "Client Name": "Spinny Vision One Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "23 Feb 2023",
      "End Date": "23 Feb 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1ux0Q_j2hqYuR32I2SzjWrasnkcTV1uwE/view"
    },
    {
      "Client Name": "Spinny Vision One Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "27 Feb 2023",
      "End Date": "27 Feb 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1e61ZnI2Lii2rbHo-3dRu5Q6m3Bl8o7dW/view"
    },
    {
      "Client Name": "Spinny Vision One Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "2 Jan 2023",
      "End Date": "2 Jan 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1OedVUsAA6vHIkOi9RbUKI705u3lxUih-/view"
    },
    {
      "Client Name": "Spinny Vision One Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "9 Jan 2023",
      "End Date": "9 Jan 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1lmY4mUUHa6WBOgUeQJBjOv6mA3BxRMlY/view"
    },
    {
      "Client Name": "Spinny Vision One Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "16 Jan 2023",
      "End Date": "16 Jan 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1zw_hh54pjY6u1OWccLz5aVvenZ1FsgBF/view"
    },
    {
      "Client Name": "Spinny Vision One Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "30 Jan 2023",
      "End Date": "30 Jan 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1XzqkYGMWtDUFdFMlCUFOLJnQevFcJAA6/view"
    },
    {
      "Client Name": "Spinny Vision One Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "3 Dec 2022",
      "End Date": "3 Dec 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/10pGlitTPf0_DDdXOfg4FOvG8mSgeFZgK/view"
    },
    {
      "Client Name": "Spinny Vision One Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "12 Dec 2022",
      "End Date": "12 Dec 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1A5o4kGplssQOp5bdM_Phb5IAUEhp6FoN/view"
    },
    {
      "Client Name": "Spinny Vision One Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "19 Dec 2022",
      "End Date": "19 Dec 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1uQpP-YfvfcWXR8MEe9h2HANt2EM9Ut4K/view"
    },
    {
      "Client Name": "Spinny Vision One Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "26 Dec 2022",
      "End Date": "26 Dec 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1HbghJXtDM-C_9KHGqH2ejDhHwgtX6-ry/view"
    },
    {
      "Client Name": "Spinny Vision One Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "7 Nov 2022",
      "End Date": "7 Nov 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1RkLJZt28LPD8GnDYHnSRsZKteR2CRJFB/view"
    },
    {
      "Client Name": "Spinny Vision One Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "14 Nov 2022",
      "End Date": "14 Nov 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1XE2dIF4WdPcfA1oRMvmbH-nyONMXLsRo/view"
    },
    {
      "Client Name": "Spinny Vision One Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "21 Nov 2022",
      "End Date": "21 Nov 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1gjpZtm-AAIjsn_BHxD7LKK5rRlEGvHit/view"
    },
    {
      "Client Name": "Spinny Vision One Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "27 Nov 2022",
      "End Date": "27 Nov 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1EnFNDEqnk-gJEtxvxvG956l3417F9qQe/view"
    },
    {
      "Client Name": "Spinny Vision One Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "3 Oct 2022",
      "End Date": "3 Oct 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1a6jUhWqu45B1rsAzdRfTnTtPDNl_NRwU/view"
    },
    {
      "Client Name": "Spinny Vision One Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "10 Oct 2022",
      "End Date": "10 Oct 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1gmo94ZfBUxajFNZY_XMHqRM0rkwDNLRb/view"
    },
    {
      "Client Name": "Spinny Vision One Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "17 Oct 2022",
      "End Date": "17 Oct 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1DxUjKiiU6FdDXmDlVlBcrQ6f0E63QJHW/view"
    },
    {
      "Client Name": "Spinny Vision One Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "24 Oct 2022",
      "End Date": "24 Oct 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/163DNiKdgBMaD2SEOR_WbYrI4PAKLMaq-/view"
    },
    {
      "Client Name": "Spinny Marathalli",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "27 Dec 2022",
      "End Date": "27 Dec 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1AKnhyLajqkljwiRoRUBkD_NDUSoH2dYE/view"
    },
    {
      "Client Name": "Spinny Marathalli",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "31 Oct 2022",
      "End Date": "31 Oct 2022",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1Ho3UccADei59JHAR_XAZqzUXveQk_gTm/view"
    },
    {
      "Client Name": "Spinny RMZ Galleria Mall",
      "Services": "Deep Cleaning",
      "Summary": "Parking Deep Cleaning",
      "Start Date": "6 Feb 2023",
      "End Date": "6 Feb 2023",
      "Frequency": "Once",
      "Status": "Done",
      "Document": "https://drive.google.com/file/d/1hAVbqKqy4OC9bRlnUQNsCoLCQ-Mwef_u/view"
    }
  ];
  

  const groupBy = (items, key) => items.reduce(
    (result, item) => ({
      ...result,
      [item[key]]: [
        ...(result[item[key]] || []),
        item,
      ],
    }), 
    {},
  );

  const groupdata = groupBy(data,'Client Name');
 // console.log('groupdata',groupdata)
  for (let clientName in groupdata){
    const society =    await getSchemaQuery('Society')({name:clientName});
    if(!society){
        console.log(`Society ${clientName}  not found`);
        continue;
    }
    for (const taskdata of groupdata[clientName]){
     // console.log('taskdata',taskdata)
        const service =    await getSchemaQuery('Service')({name:taskdata['Services']});
        if(!service){
            console.log(`Service ${taskdata.Services}  not found `);
            continue;
        }
        const serviceSubsubscription = await getSchemaQuery('ServiceSubscription')({society:society,service:service});
        if(!serviceSubsubscription){
            console.log(`No Service Subscription Found for Society: ${society.get('name')} and Service: ${service.get('name')} `);
            continue;
        }
        const taskObj = {
            summary:taskdata['Summary'],
            startDate:new Date(taskdata['Start Date']),
            endDate : new Date(taskdata['End Date']),
            frequency: taskdata['Frequency'],
            status:'Active'
        };
       // console.log(taskObj)
        const task = await createRecord('Task')(taskObj);
        console.log(task.get('objectId'));
        const relation =  serviceSubsubscription.relation('tasks');
        relation.add(task);
        await  serviceSubsubscription.save(null,getSaveOrQueryOption());
    }
}
   
  