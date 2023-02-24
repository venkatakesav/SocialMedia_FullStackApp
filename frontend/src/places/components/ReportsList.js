import ReportItem from "./ReportItem"
import "./PlaceList.css"

import React from "react"

function ReportsList(props) {
    const currentDate = new Date();
    console.log(currentDate)
    return (
      <React.Fragment>
        {console.log(props.items)}
        {props.items && (
          <ul className="place-list">
            {props.items.map(report => {
              const createdAtDate = new Date(report.creationDate);
              console.log(createdAtDate)
              const timeDifference = currentDate - createdAtDate;
              if (timeDifference < 1800000) { //Modify this variable in order to change the time limit for reports
                return (
                  <ReportItem
                    key={report.id}
                    id={report.id}
                    reported_by={report.reportedBy}
                    reported_per={report.reportedUser}
                    concern={report.concern}
                    post_id={report.reportedPost}
                    isIgnored={report.isIgnored}
                  />
                );
              }
              return null;
            })}
          </ul>
        )}
        {/* {!props.items && (
          <div className="center">No Reports Present</div>
        )} */}
      </React.Fragment>
    );
  }
export default ReportsList