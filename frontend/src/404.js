import { MDBNavbarLink } from "mdb-react-ui-kit";

const PageNotFound = () => {
  return (
    <>
      <h1 style={{ margin: "20px", color:"#CC9AA6" }}>Page Is Not Found </h1>
      <section class="error-container">
        <span class="four">
          <span class="screen-reader-text">4</span>
        </span>
        <span class="zero">
          <span class="screen-reader-text">0</span>
        </span>
        <span class="four">
          <span class="screen-reader-text">4</span>
        </span>
      </section>
      <div class="link-container">
        <MDBNavbarLink
          active
          aria-current="page"
          className="link-hover more-link"
          style={{ color: "#ffffff" }}
          href="/"
        >
          <b>Visit the original page</b>
        </MDBNavbarLink>
      </div>
    </>
  );
};

export default PageNotFound;
