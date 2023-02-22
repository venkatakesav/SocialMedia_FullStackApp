import ReportItem from "./ReportItem"

import "./PlaceList.css"

function ReportsList(props) {
  return (
    <ul className="place-list">
      {props.items.map(report => (
        <ReportItem
          key={report.id}
          id={report.id}
          reported_by={report.reported_by}
          reported_per={report.reported_per}
          concern={report.concern}
          post_id={report.post_id}
        />))}
    </ul>
  )
}
export default ReportsList