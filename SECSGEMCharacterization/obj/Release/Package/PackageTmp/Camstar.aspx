<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Camstar.aspx.cs" Inherits="SECSGEMCharacterization.Camstar" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <h1>CAMSTAR TEST (<asp:Label runat="server" ID="lblServer"></asp:Label>)</h1>
    <a href="Index.aspx">Back to Equipment</a><br /><br />
    <a href="TrackIn.aspx">Track In</a><br /><br />
    <asp:Button runat="server" ID="btnFirstInsert" Text="First Insert" onclick="btnFirstInsert_Click"/>
    &nbsp;<asp:Button runat="server" ID="btnResetReject" Text="Reset Rejects" onclick="btnResetReject_Click"/>
    &nbsp;<asp:Button runat="server" ID="btnLotRejects" Text="Lot Rejects" onclick="btnLotRejects_Click" />
    <table>
        <tr>
            <td>
                User ID:
            </td>
            <td>
                <asp:TextBox runat="server" id="txtUser" Text="jacupan"></asp:TextBox>
            </td>
        </tr>
    </table>
    <br />
    <table>
        <tr>
            <td>Select Type:</td>
            <td><asp:DropDownList runat="server" ID="ddType" AutoPostBack="true" onselectedindexchanged="ddType_SelectedIndexChanged"></asp:DropDownList></td>
        </tr>
    </table><br />

    <b><asp:Label runat="server" ID="lblType" Text=""></asp:Label></b><br /><br />

    <table>
        <tr>
            <td>Result:</td>
            <td><asp:Label runat="server" ID="lblResult" Text="N/A" Font-Bold="true" ForeColor="Black"></asp:Label></td>
        </tr>
        <tr runat="server" id="trIMG">
            <td>
            <asp:Button runat="server" ID="btnView" Text="View" onclick="btnView_Click" />
            </td>
        </tr>
    </table>

    <table runat="server" id="tblAdhoc">
        <tr>
            <td>Equipment:</td>
            <td><asp:DropDownList runat="server" ID="ddEquip" AutoPostBack="true"></asp:DropDownList></td>
        </tr>
        <tr>
            <td>Setup:</td>
            <td><asp:DropDownList runat="server" ID="ddSetup" AutoPostBack="true"></asp:DropDownList></td>
        </tr>
        <tr>
            <td colspan="2" align="left">
                <asp:Button runat="server" ID="btnAdhoc" Text="Submit" onclick="btnAdhoc_Click" />
            </td>
        </tr>
        <tr>
            <td colspan="2">&nbsp;</td>
        </tr>
        <tr>
            <td><asp:TextBox runat="server" ID="textbox1"></asp:TextBox></td>
            <td><asp:TextBox runat="server" ID="textbox2"></asp:TextBox></td>
        </tr>
        <tr>
            <td><asp:TextBox runat="server" ID="textbox3"></asp:TextBox></td>
            <td><asp:TextBox runat="server" ID="textbox4"></asp:TextBox></td>
        </tr>
        <tr>
            <td><asp:TextBox runat="server" ID="textbox5"></asp:TextBox></td>
            <td><asp:TextBox runat="server" ID="textbox6"></asp:TextBox></td>
        </tr>
        <tr>
            <td><asp:TextBox runat="server" ID="textbox7"></asp:TextBox></td>
            <td><asp:TextBox runat="server" ID="textbox8"></asp:TextBox></td>
        </tr>
        <tr>
            <td><asp:TextBox runat="server" ID="textbox9"></asp:TextBox></td>
            <td><asp:TextBox runat="server" ID="textbox10"></asp:TextBox></td>
        </tr>
        <tr>
            <td><asp:TextBox runat="server" ID="textbox11"></asp:TextBox></td>
            <td><asp:TextBox runat="server" ID="textbox12"></asp:TextBox></td>
        </tr>
        <tr>
            <td><asp:TextBox runat="server" ID="textbox13"></asp:TextBox></td>
            <td><asp:TextBox runat="server" ID="textbox14"></asp:TextBox></td>
        </tr>
        <tr>
            <td><asp:TextBox runat="server" ID="textbox15"></asp:TextBox></td>
            <td><asp:TextBox runat="server" ID="textbox16"></asp:TextBox></td>
        </tr>
        <tr>
            <td><asp:TextBox runat="server" ID="textbox17"></asp:TextBox></td>
            <td><asp:TextBox runat="server" ID="textbox18"></asp:TextBox></td>
        </tr>
        <tr>
            <td><asp:TextBox runat="server" ID="textbox19"></asp:TextBox></td>
            <td><asp:TextBox runat="server" ID="textbox20"></asp:TextBox></td>
        </tr>
        <tr>
            <td><asp:TextBox runat="server" ID="textbox21"></asp:TextBox></td>
            <td><asp:TextBox runat="server" ID="textbox22"></asp:TextBox></td>
        </tr>
        <tr>
            <td><asp:TextBox runat="server" ID="textbox23"></asp:TextBox></td>
            <td><asp:TextBox runat="server" ID="textbox24"></asp:TextBox></td>
        </tr>
        <tr>
            <td><asp:TextBox runat="server" ID="textbox25"></asp:TextBox></td>
            <td><asp:TextBox runat="server" ID="textbox26"></asp:TextBox></td>
        </tr>
        <tr>
            <td><asp:TextBox runat="server" ID="textbox27"></asp:TextBox></td>
            <td><asp:TextBox runat="server" ID="textbox28"></asp:TextBox></td>
        </tr>
        <tr>
            <td><asp:TextBox runat="server" ID="textbox29"></asp:TextBox></td>
            <td><asp:TextBox runat="server" ID="textbox30"></asp:TextBox></td>
        </tr>
        <tr>
            <td><asp:TextBox runat="server" ID="textbox31"></asp:TextBox></td>
            <td><asp:TextBox runat="server" ID="textbox32"></asp:TextBox></td>
        </tr>
        <tr>
            <td><asp:TextBox runat="server" ID="textbox33"></asp:TextBox></td>
            <td><asp:TextBox runat="server" ID="textbox34"></asp:TextBox></td>
        </tr>
        <tr>
            <td><asp:TextBox runat="server" ID="textbox35"></asp:TextBox></td>
            <td><asp:TextBox runat="server" ID="textbox36"></asp:TextBox></td>
        </tr>
        <tr>
            <td><asp:TextBox runat="server" ID="textbox37"></asp:TextBox></td>
            <td><asp:TextBox runat="server" ID="textbox38"></asp:TextBox></td>
        </tr>
        <tr>
            <td><asp:TextBox runat="server" ID="textbox39"></asp:TextBox></td>
            <td><asp:TextBox runat="server" ID="textbox40"></asp:TextBox></td>
        </tr>
        <tr>
            <td><asp:TextBox runat="server" ID="textbox41"></asp:TextBox></td>
            <td><asp:TextBox runat="server" ID="textbox42"></asp:TextBox></td>
        </tr>
        <tr>
            <td><asp:TextBox runat="server" ID="textbox43"></asp:TextBox></td>
            <td><asp:TextBox runat="server" ID="textbox44"></asp:TextBox></td>
        </tr>
        <tr>
            <td><asp:TextBox runat="server" ID="textbox45"></asp:TextBox></td>
            <td><asp:TextBox runat="server" ID="textbox46"></asp:TextBox></td>
        </tr>
        <tr>
            <td><asp:TextBox runat="server" ID="textbox47"></asp:TextBox></td>
            <td><asp:TextBox runat="server" ID="textbox48"></asp:TextBox></td>
        </tr>
        <tr>
            <td><asp:TextBox runat="server" ID="textbox49"></asp:TextBox></td>
            <td><asp:TextBox runat="server" ID="textbox50"></asp:TextBox></td>
        </tr>
        <tr>
            <td><asp:TextBox runat="server" ID="textbox51"></asp:TextBox></td>
            <td><asp:TextBox runat="server" ID="textbox52"></asp:TextBox></td>
        </tr>
        <tr>
            <td><asp:TextBox runat="server" ID="textbox53"></asp:TextBox></td>
            <td><asp:TextBox runat="server" ID="textbox54"></asp:TextBox></td>
        </tr>
    </table>
    
    <table runat="server" id="tblLotStat">
        
        <tr>
            <td>LOT No.:</td>
            <td><asp:TextBox runat="server" ID="txtLotNo">1539029DNAA</asp:TextBox></td>
        </tr>
        <tr>
            <td colspan="2" align="right">
                <asp:Button runat="server" id="btnLotStat" Text="Submit" onclick="btnLotStat_Click"/>
            </td>
        </tr>
    </table>
    
    </form>
</body>
</html>
