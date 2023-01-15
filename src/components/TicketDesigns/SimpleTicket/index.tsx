/**
 * Copied over from @cloudfns/stamp
 */

import { FunctionComponent } from "react";

export interface SimpleTicketProps {
  coverPhoto: string;
  sponsorLogos: string[];
  teamName: string;
  playerHeadshot?: string;
  themeColor: string;
}
const SimpleTicket: FunctionComponent<SimpleTicketProps> = (props) => {
  return (
    <div
      style={{
        position: "relative",
        // width: "100%",
        // height: "1650px",
        width: "80%",
        maxWidth: "420px",
        height: "42vh",
        maxHeight: "800px",
        // paddingBottom: "85%",
        // overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        textAlign: "center",
        color: "#fff",
        // filter: "drop-shadow(0px 4px 30px #ffffff)",
        filter: `drop-shadow(0px 4px 30px ${props.themeColor})`,
      }}
    >
      <div
        style={{
          alignSelf: "stretch",
          borderRadius: "38px 38px 0px 0px",
          backgroundColor: props.themeColor,
          // height: "180px",
          flexShrink: "0",
          display: "flex",
          flexDirection: "row",
          padding: "22px 0px",
          minHeight: "80px",
          boxSizing: "border-box",
          alignItems: "center",
          justifyContent: "center",
          // zIndex: "3",
        }}
      >
        <h2
          style={{
            margin: "0",
            flex: "1",
            position: "relative",
            fontWeight: "700",
            fontSize: "30px",
          }}
        >
          {props.teamName.slice(0, 18)}
        </h2>
      </div>
      <div
        style={{
          alignSelf: "stretch",
          height: "100%",
          flexShrink: "0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          position: "relative",
          // zIndex: "2",
        }}
      >
        <img
          style={{
            alignSelf: "stretch",
            flex: "1",
            position: "relative",
            maxWidth: "100%",
            overflow: "hidden",
            maxHeight: "100%",
            objectFit: "cover",
            // zIndex: "0",
          }}
          alt=""
          id="bg1"
          src={props.coverPhoto}
        />
        {props.playerHeadshot && (
          <img
            style={{
              position: "absolute",
              margin: "0",
              // bottom: "324.33px",
              bottom: "0px",
              // left: "calc(50% - 450px)",
              left: "10px",
              maxWidth: "180px",
              width: "100%",
              maxHeight: "210px",
              flexShrink: "0",
              objectFit: "contain",
              // zIndex: "2",
            }}
            alt=""
            id="headshot"
            src={props.playerHeadshot}
          />
        )}

        <div
          style={{
            position: "absolute",
            margin: "0",
            bottom: "-10px",
            // left: "calc(50% - 450px)",
            background: `linear-gradient(180deg, rgba(0, 0, 0, 0), ${props.themeColor}BB 50%, ${props.themeColor})`,
            width: "100%",
            height: "100px",
            flexShrink: "0",
            // zIndex: "2",
          }}
        />
      </div>
      <div
        style={{
          alignSelf: "stretch",
          backgroundColor: props.themeColor,
          // height: "110px",
          flexShrink: "0",
          display: "flex",
          flexDirection: "row",
          // padding: "26px 16px 10px",
          padding: "20px 16px",
          boxSizing: "border-box",
          alignItems: "center",
          justifyContent: "center",
          // zIndex: "1",
          fontSize: "22px",
          borderRadius: "0px 0px 20px 20px",
        }}
      >
        <div
          style={{
            flex: "1",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "23px",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "inline-block",
              // width: "358px",
              flexShrink: "0",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontWeight: "800" }}>🎁</span>
            <i style={{ fontWeight: "800" }}> LOOTBOX</i>
          </div>
          <div
            style={{
              position: "relative",
              fontSize: "14px",
              textAlign: "left",
            }}
          >
            Gamers win you stuff
          </div>
        </div>
      </div>
      {/* <LogoSection
        logoUrls={props.sponsorLogos}
        backgroundColor={props.themeColor}
      /> */}
    </div>
  );
};

export default SimpleTicket;
