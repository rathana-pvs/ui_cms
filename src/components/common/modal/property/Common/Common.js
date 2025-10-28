import {Tabs} from "antd";
import TabPane from "antd/es/tabs/TabPane";
import GeneralParam from "@/components/ui/dialogs/property/Common/GeneralParam";
import AdvanceParam from "@/components/ui/dialogs/property/Common/AdvanceParam";


export default function (){



    return (
        <div style={{padding: "8px" }}>
            <Tabs defaultActiveKey="1">
                <TabPane tab="General" key="1">
                    <GeneralParam/>
                </TabPane>
                <TabPane tab="Advance" key="2">
                    <AdvanceParam/>
                </TabPane>
            </Tabs>
        </div>
    )

}