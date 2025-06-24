import React from "react";
import Channel  from "../components/Channel/Channel";

import { useParams } from "react-router-dom";

function ChannelPage() {
    const { username } = useParams();

    return <Channel username={username} />;
}

export default ChannelPage;