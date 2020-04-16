const express = require('express')
const puppeteer = require('puppeteer')
const select = require ('puppeteer-select');
const bodyParser = require('body-parser')
const app = express()

app.listen(3000, () =>
  console.log('listening on port 3000!'),
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/linkedin-connect', (req, res) => {
    console.log('Got body:', req.body);

    var linkedinUrl = req.body.profile;
    var cookie = req.body.cookie;
    var message = req.body.message;

    if (linkedinUrl && linkedinUrl.includes('linkedin.com/in/')) {(async () => {
      const browser = await puppeteer.launch({
       headless: true,
       timeout: 120000,
       slowMo: 120});
      const page = await browser.newPage();
      await page.setCookie({
        'name': 'li_at',
        'value': cookie,
        'domain': '.www.linkedin.com'
      })

      await page.goto(linkedinUrl);
      await page.waitFor(1000);

      const element = await page.$(".pv-top-card--list li:first-child");
      const text = await page.evaluate(element => element.textContent, element);
      const firstName = text.trim().split(" ")[0];

      // Send Connection Request

      // Ok, didi madloba. And now, how can I add first name into custom message here?

      console.log(firstName)

      const connectionElement = await page.$("span.dist-value");
      const connectionDegree = await page.evaluate(connectionElement => connectionElement.textContent, connectionElement);

      if (connectionDegree.includes("1st")){
        console.log("Already Connection");
        await browser.close();

      } else {

      console.log(connectionDegree)


      }

      const titleElement = await page.$("div.display-flex.mt2 > div.flex-1.mr5 > h2");
      const title = await page.evaluate(titleElement => titleElement.textContent, titleElement);

      console.log(title)

      const statusElement = await page.$(".pv-s-profile-actions--connect");
      const status = await page.evaluate(statusElement => statusElement.textContent, statusElement);

      console.log(status);

      var str = status;
      if (str.includes("Pending")){
        console.log("Connection Pending");
        await browser.close();

      } else {



    const [connect] = await page.$x("//button[contains(., 'Connect')]");

        if (connect) {
          await connect.click();
        }

       else

        {
          const dropdown = await page.click(".pv-s-profile-actions__overflow-toggle");
          const [connectDropdown] = await page.$x("//span[contains(., 'Connect')]");

            if (connectDropdown) {
          await connectDropdown.click();

      };
    };

    }


      const customMessage = await page.click("#custom-message");
          if (await page.$("#custom-message") !== null) {
                await page.waitFor(1000);
                await page.keyboard.type(firstName +' I would like to connect on LinkedIn', {delay: 10}); // Types slower, like a user
              } else {
                await page.waitFor(1000);
                const addNote = await page.$x("//button[contains(., 'Add a note')]");
                await page.waitFor(1000);
                await addNote.click();
                await page.waitFor(1000);
                await customMessage.click();
                await page.keyboard.type(firstName +' I would like to connect on LinkedIn', {delay: 10}); // Types slower, like

    }

      await page.waitFor(1000);

      const [button] = await page.$x("//button[contains(., 'Send invitation')]");
      if (button) {
          await button.click();
      } else {
        console.log(e,'-error')}



      // Check Connection is Pending
      await page.goto(linkedinUrl);
      const invitationElement = await page.$(".pv-s-profile-actions--connect");
      const initationStatus = await page.evaluate(invitationElement => invitationElement.textContent, invitationElement);
      await page.waitFor(1000);
      console.log(initationStatus);



      await browser.close();

      res.json({ 'linkedin URL': linkedinUrl.trim(),
                  'connectionDegree': connectionDegree.trim(),
                  'firstName': firstName.trim(),
                  'title': title.trim(),
                  'invitationStatus': initationStatus.trim(),
                  })

      var Airtable = require('airtable');
      var base = new Airtable({apiKey: 'keyv7OeSSAzrj1WQ3'}).base('appEBd7C2JwZ3KUqs');

      base('Database 🤑').create([
        {
          "fields": {
            "Website": profileUrl,
            "First Name": firstName,
          }
        }
      ], function(err, records) {
        if (err) {
          console.error(err);
          return;
        }
        records.forEach(function (record) {
          console.log(record.getId());
        });
      });

      //title
      //connection degree


    })();
      // TODO: this should be a worker process
      // We should send an event to the worker process and wait for an update
      // So this server can handle more concurrent connections

    } else {
      res.json({
        message: 'Missing the url parameter. Or given URL is not an LinkedIn URL.'
      })
    }

});
