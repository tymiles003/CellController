<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="TrackIn.aspx.cs" Inherits="SECSGEMCharacterization.TrackIn" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <a href="Camstar.aspx">Back</a><br /><br />
    <h1>TEST TRACK IN/OUT (<asp:Label runat="server" ID="lblServer"></asp:Label>)</h1>

    <table>
        <tr>
            <td>Type</td>
            <td><asp:DropDownList ID="ddType" runat="server" AutoPostBack="true" onselectedindexchanged="ddType_SelectedIndexChanged"></asp:DropDownList></td>
        </tr>
        <tr>
            <td>User ID</td>
            <td><asp:TextBox runat="server" ID="txtUserID"></asp:TextBox></td>
        </tr>
    </table>
    <br />

    <table>
        <tr>
            <td>Result:</td>
            <td>
                <asp:Label runat="server" ID="lblResult" Text="N/A" ForeColor="Black" Font-Bold="true"></asp:Label>
            </td>
        </tr>
    </table>

    <table runat="server" id="tblTrackIn" visible="true">
        <tr>
            <td>Lot No.</td>
            <td><asp:TextBox runat="server" Text="" ID="txtLotTrackIn"></asp:TextBox></td>
        </tr>
        <tr>
            <td>Track In Qty</td>
            <td><asp:TextBox runat="server" Text="" ID="txtTrackInQty"></asp:TextBox></td>
        </tr>
         <tr>
            <td>Equipment</td>
            <td><asp:TextBox runat="server" Text="" ID="txtEquipmentTrackIn"></asp:TextBox></td>
        </tr>
        <tr>
            <td>Comment</td>
            <td><asp:TextBox runat="server" Text="" ID="txtCommentTrackIn"></asp:TextBox></td>
        </tr>
        <tr>
            <td>
                <asp:Button runat="server" ID="btnTrackIN" Text="Track In" onclick="btnTrackIN_Click" />
            </td>
        </tr>
    </table>
    <table runat="server" id="tblTrackOut" visible="false">
        <tr>
            <td>Lot No.</td>
            <td><asp:TextBox runat="server" Text="" ID="txtLotTrackOut"></asp:TextBox></td>
        </tr>
        <tr>
            <td>Track Out Qty</td>
            <td><asp:TextBox runat="server" Text="" ID="txtTrackOutQty"></asp:TextBox></td>
        </tr>
        <tr>
            <td>Total Scrap Qty</td>
            <td><asp:TextBox runat="server" Text="" ID="txtTotalScrapQty"></asp:TextBox></td>
        </tr>
        <tr>
            <td>Equipment</td>
            <td><asp:TextBox runat="server" Text="" ID="txtEquipmentTrackOut"></asp:TextBox></td>
        </tr>
        <tr>
            <td>Comment</td>
            <td><asp:TextBox runat="server" Text="" ID="txtCommentTrackOut"></asp:TextBox></td>
        </tr>
        <tr>
            <td>
                <asp:Button runat="server" ID="btnTrackOut" Text="Track Out" onclick="btnTrackOut_Click"/>
            </td>
        </tr>
    </table>
    
    </form>
</body>
</html>
