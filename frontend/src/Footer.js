import React from "react";
import {
  MDBFooter,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdb-react-ui-kit";

const Footer = () => {
  return (
    <MDBFooter
      className="text-center text-lg-start text-muted"
      style={{ backgroundColor: "#4F5A3B" }}
    >
      <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
        <div className="me-5 d-none d-lg-block">
          <span style={{ color: "#ffffff" }}>
            Get connected with us on social networks:
          </span>
        </div>

        <div>
          <a
            href="https://www.facebook.com/share/1K4n33DP7R/?mibextid=wwXIfr"
            target="_blank"
            className="me-4 text-reset"
          >
            <MDBIcon style={{ color: "#ffffff" }} className="link-hover" fab icon="facebook-f" />
          </a>
          <a
            href="https://www.instagram.com/gakondo_tour?igsh=YzE5N2Zwa2x4bmw%3D&utm_source=qr"
            target="_blank"
            className="me-4 text-reset"
          >
            <MDBIcon style={{ color: "#ffffff" }} className="link-hover" fab icon="instagram" />
          </a>
        </div>
      </section>

      <section className="">
        <MDBContainer className="text-center text-md-start mt-5">
          <MDBRow className="mt-3">
            <MDBCol md="4" lg="4" xl="4" className="mx-auto mb-4">
              <h6
                className="text-uppercase fw-bold mb-4"
                style={{ color: "#ffffff" }}
              >
                <MDBIcon
                  style={{ color: "#ffffff" }}
                  icon="gem"
                  className="me-3"
                />
                KIVU GAKONDO TOUR
              </h6>
              <p style={{ color: "#c4c3c3" }}>
                Discover Rwanda like never before with Gakondo Tours! We offer
                an array of unforgettable experiences, including hiking, boat
                trips, banana beer demonstrations, and the scenic Congo Nile
                Trail. Explore rural areas, enjoy tea and coffee tours, and
                immerse yourself in local culture with family meals. Don't miss
                the stunning Lake Kivu and Gisenyi city tours, as well as our
                hot spring and island adventures. Thank you for choosing us for
                your Rwandan journey!
              </p>
            </MDBCol>
            <MDBCol md="4" lg="3" xl="3" className="mx-auto mb-md-0 mb-4">
              <h6
                className="text-uppercase fw-bold mb-4"
                style={{ color: "#ffffff" }}
              >
                Contact
              </h6>
              <p style={{ color: "#ffffff" }}>
                <MDBIcon
                  style={{ color: "#ffffff" }}
                  icon="home"
                  className="me-2"
                />
                Rwanda, Gisenyi 🇷🇼, Nyamyumba
              </p>
              <p style={{ color: "#ffffff" }}>
                <MDBIcon
                  style={{ color: "#ffffff" }}
                  icon="envelope"
                  className="me-3"
                />
                gakondobykoffitours@gmail.com
              </p>
              <p style={{ color: "#ffffff" }}>
                <MDBIcon
                  style={{ color: "#ffffff" }}
                  icon="phone"
                  className="me-3"
                />{" "}
                +250788589296
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div
        className="text-center p-4"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.05)", color: "#ffffff" }}
      >
        © 2025 Copyright:{" "}
        <a
          className="text-reset fw-bold link-hover"
          href="https://www.linkedin.com/in/ahmed-alamassi-4655b9252/"
          target="_blank"
        >
          Ahmed (Christian) Alamassi
        </a>
      </div>
    </MDBFooter>
  );
};

export default Footer;
