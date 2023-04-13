const axios = require('axios');
// Get Access token for Zoho CRM 
const FormData = require('form-data');
const json = require('formidable/src/plugins/json');
let data1 = new FormData();
data1.append('client_id', 'Your crm scope client id');
data1.append('client_secret', 'crm scope client secret');
data1.append('refresh_token', 'crm scope refresh token ');
data1.append('grant_type', 'refresh_token');

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://accounts.zoho.com/oauth/v2/token',
  headers: {
    ...data1.getHeaders()
  },
  data: data1
};

axios.request(config)
  .then((response) => {
    var token = response.data.access_token;
    global.zoho_crm_api_token = token;
    console.log("zoho_crm_api_token ==", zoho_crm_api_token);

    getrecord(zoho_crm_api_token);
  })
  .catch((error) => {
    console.log(error);
  });


//
// Get record by Id Zoho CRM
// 

function getrecord(access_token) {
    var crm_contact_record_id = "your crm contact record id";
  console.log("function getrecords", access_token);
  // const axios = require('axios');
  // let data2 = '';

  let config2 = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://crm.zoho.com/crm/v2/modulename/'+crm_contact_record_id,
    headers: {
      'Authorization': 'Zoho-oauthtoken ' + zoho_crm_api_token,
    },
    data: ''
  };

  axios.request(config2)
    .then((response) => {
      var getrecorddata = JSON.stringify(response.data);
      console.log("Getrecordbyid", getrecorddata);
      record_id = JSON.stringify(response.data.data[0].id);
      console.log("record id == " + record_id);
      record_From = JSON.stringify(response.data.data[0].From);
      console.log("record INR amount == " + record_From);
      record_To = JSON.stringify(response.data.data[0].To);
      console.log("record usd == " + record_To);
      record_INR = JSON.stringify(response.data.data[0].INR);
      console.log("record INR  == " + record_INR);

      global.Contact_record_id = response.data.data[0].Contact.id;

      console.log("Contact data", Contact_record_id);
      //   record_CNY = JSON.stringify(response.data.data[0].CNY);
      //   console.log("record cny == "+record_CNY);
      //   record_YUAN = JSON.stringify(response.data.data[0].YUAN);
      //   console.log("record yuan == "+record_YUAN);
      //

      //   let recordObj = {
      //     'record_id': record_id,
      //     'from': record_From,
      //     'to':record_To,
      //     'amount':record_INR,
      //     'Contact':Contact_record_data
      //     // 'record_CNY':record_CNY,
      //     // 'record_YUAN':record_YUAN
      //   }


      //   getcurrency(recordObj)
      getcontactrecord(Contact_record_id);

    })
    .catch((error) => {
      console.log(error);
    });
}

// [[[[[[[[[[[]]]]]]]]]]] get contact record data in zoho crm
function getcontactrecord(contactid) {
  let config3 = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://crm.zoho.com/crm/v2/Contacts/' + contactid,
    headers: {
      'Authorization': 'Zoho-oauthtoken ' + zoho_crm_api_token,
    },
    data: ''
  };

  axios.request(config3)
    .then((response) => {

      global.crm_contact_record = JSON.stringify(response.data.data[0]);
      //   console.log("Getrecordbyid",getrecorddata);


      global.contact_email = JSON.stringify(response.data.data[0].Email);
      console.log("contact_email id == " + contact_email);
      global.contact_full_name = JSON.stringify(response.data.data[0].Full_Name);
      console.log("contact_full_name id == " + contact_full_name);
      search_contact_books(contact_email, contact_full_name)
    })
    .catch((error) => {
      console.log(error);
    });
}
function search_contact_books(...searchmap) {
  // console.log("searchmap data =",searchmap);

  // Get access token of Zoho Books for creating contacts
  // const FormData = require('form-data');
  // const json = require('formidable/src/plugins/json');
  let data2 = new FormData();
  data2.append('client_id', 'books scope client id');
  data2.append('client_secret', 'books scope client secret');
  data2.append('refresh_token', 'books refresh token');
  data2.append('grant_type', 'refresh_token');

  let config12 = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://accounts.zoho.com/oauth/v2/token',
    headers: {
      ...data2.getHeaders()
    },
    data: data2
  };

  axios.request(config12)
    .then((response) => {
      global.book_access_token = JSON.stringify(response.data.access_token);
      console.log("zoho book access token", book_access_token);
      get_book_contacts(searchmap);
    })
    .catch((error) => {
      console.log(error);
    });
}
// [[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]  End of Zoho Books Access token

// [[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]     Get Contacts of zoho books 

function get_book_contacts(contact_details) {
  var contact_book_email = contact_details[0];
  var contact_book_name = contact_details[1];
  console.log("contacts email =" + contact_book_email, "contact name =", contact_book_name);
  console.log("books access token data == " + book_access_token);

  let data13 = new FormData();
  let book_acc = book_access_token.slice(1);
  let book_acc2 = book_acc.slice(0, book_acc.length - 1);
  global.bookaccesstoken = book_acc2;
  var org_id="";

  let config13 = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://books.zoho.com/api/v3/contacts?organization_id='+org_id,
    headers: {
      'Authorization': 'Zoho-oauthtoken ' + book_acc2,
      ...data13.getHeaders()
    },
    data: data13
  };

  axios.request(config13)
    .then((response) => {
      var all_books_contacts_data = response.data.contacts;
      // console.log("contact all records dta ==",all_books_contacts_data);
      let email = contact_book_email.slice(1);
      let last_email = email.slice(0, email.length - 1);

      for (let data of all_books_contacts_data) {
        if (data.email == last_email) {
          var book_record = data;
          console.log('data', book_record);
        }
        else {
          //[[[[[[[[[[[[]]]]]]]]]]]] Create customer in Zoho Books 

          console.log("Contact not found in books")
          global.notfound = "null";


        }
      }
      create_customer(notfound, book_acc2);
      //     var contactname_books = JSON.stringify(response.data.data.contact_name);
      //     var contact_email_books = JSON.stringify(response.data.data.email);
      //   console.log("contactname_books :",contactname_books,"contact_email_books :",contact_email_books);

    })
    .catch((error) => {
      console.log(error);
    });
}

// End of Zoho Book get  data

// [[[[[[[[[[]]]]]]]]]] Create a customer in zoho books

function create_customer(...not_get) {
  // const axios = require('axios');
  if (notfound == "null") {
    var acc_dataa = not_get[1];
    global.testdatata = acc_dataa;
    console.log("Accesing book token in custoer create function", acc_dataa);
    // var cut_first =acc_dataa.slice(1);
    // var cut_last = cut_first.slice(0, cut_first.length - 1);
    // console.log("acc_data ="+cut_last);
    let data111 = JSON.stringify({
      "contact_name": contact_full_name,
      "customer_name": contact_full_name,
      "company_name": "API Testing",
      "email": contact_email,
      "phone": "",
      "mobile": ""
    });

    let config111 = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://books.zoho.com/api/v3/contacts?organization_id='+org_id,
      headers: {
        'Authorization': 'Bearer ' + testdatata,
        'Content-Type': 'application/json',
      },
      data: data111
    };

    axios.request(config111)
      .then((response) => {
        global.books_customer_id =JSON.stringify(response.data.contact.contact_id)
        console.log("Record created==", books_customer_id);
        createinvoice(acc_dataa);
      })
      .catch((error) => {
        console.log(error);
      });


  }
}

// Create Invoice of the customer

function createinvoice() {
  
  var cus_cut_first = books_customer_id.slice(1);
  var cus_cut_last = cus_cut_first.slice(0, cus_cut_first.length - 1);
  console.log("acc invoice data token", testdatata,"custo id --",cus_cut_last);

  // const axios = require('axios');
  // let data44 = '{\r\n            "customer_name": "\\"testing abc\\"",\r\n            "customer_id": "3214622000000531001",\r\n            "company_name": "API Testing",\r\n            "status": "draft",\r\n            // "invoice_number": "INV-000012",\r\n            "date": "2023-04-13",\r\n            "due_date": "2023-04-30",\r\n            "due_days": "",\r\n            "email": "",\r\n            "currency_code": "USD",\r\n            "currency_symbol": "$",\r\n            "template_type": "standard",\r\n            "is_viewed_by_client": false,\r\n            "has_attachment": false,\r\n            "client_viewed_time": "",\r\n            "project_name": "",\r\n            "line_items": [\r\n            {\r\n                // "line_item_id": "3214622000000523139",\r\n                "item_id": "3214622000000200070",\r\n                "item_order": 1,\r\n                "name": "Corn Gluten Meal 60%",\r\n                "description": "Test api",\r\n                "unit": "Quintal",\r\n                "quantity": 1.00,\r\n                "discounts": [],\r\n                "bcy_rate": 45.00,\r\n                "rate": 45.00,\r\n                "account_name": "Sales"\r\n                \r\n            }\r\n        ]\r\n        }';
  ///[[[[[[[[[[[[[[]]]]]]]]]]]]]]
  let data44 = {
    "customer_name": "\"testing abc\"",
    "customer_id": cus_cut_last,
    "company_name": "API Testing",
    "status": "draft",
    // "invoice_number": "INV-000012",
    "date": "2023-04-13",
    "due_date": "2023-04-30",
    "due_days": "",
    "email": "",
    "currency_code": "USD",
    "currency_symbol": "$",
    "template_type": "standard",
    "is_viewed_by_client": false,
    "has_attachment": false,
    "client_viewed_time": "",
    "project_name": "",
    "line_items": [
      {
        // "line_item_id": "3214622000000523139",
        "item_id": "3214622000000200070",
        "item_order": 1,
        "name": "Corn Gluten Meal 60%",
        "description": "Test api",
        "unit": "Quintal",
        "account_id": "3214622000000000388", 
        "quantity": 1.00,
        "discounts": [],
        "bcy_rate": 45.00,
        "rate": 45.00,
        "account_name": "Sales"

      }
    ]
  }
  let config44 = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://books.zoho.com/api/v3/invoices?organization_id='+org_id,
    headers: {
      'Authorization': 'Bearer ' + testdatata,
      'Content-Type': 'application/json'
    },
    data: data44
  };

  axios.request(config44)
    .then((response) => {
      console.log("Invoice created", JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
}

