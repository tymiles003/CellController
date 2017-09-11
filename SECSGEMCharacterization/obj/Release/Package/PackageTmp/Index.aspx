<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Index.aspx.cs" Inherits="SECSGEMCharacterization.Index" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <h1>TEST EQUIPMENT CONNECTION (<asp:Label runat="server" ID="lblServer"></asp:Label>)</h1>
    <a href="Camstar.aspx">CAMSTAR TEST</a>
    <br /><br />
    <div>
    <table>
        <tr>
            <td>Equipment Status:</td>
            <td><asp:Label runat="server" ID="lblStatus" Text="UNKNOWN" ForeColor="Black" Font-Bold="true"></asp:Label></td>
        </tr>
        <tr>
            <td>JSON Response:</td>
            <td><asp:Label runat="server" ID="lblJSON" ForeColor="Black" Text="N/A" Font-Bold="true"></asp:Label></td>
        </tr>
        <tr>
            <td>SECS Name:</td>
            <td><asp:DropDownList runat="server" ID="ddSECS" onselectedindexchanged="ddSECS_SelectedIndexChanged" AutoPostBack="true"></asp:DropDownList></td>
        </tr>
        <%--<tr id="trVariable" runat="server">
            <td><asp:Label runat="server" ID="lblVariable" Text=""></asp:Label></td>
            <td><asp:CheckBoxList ID="chkVariable" runat="server" onselectedindexchanged="chkVariable_SelectedIndexChanged" AutoPostBack="true"></asp:CheckBoxList></td>
        </tr>--%>
        <tr id="trVariable" runat="server">
            <td><asp:Label runat="server" ID="lblVariable" Text=""></asp:Label></td>
            <td><asp:TextBox runat="server" ID="txtVariable"></asp:TextBox></td>
        </tr>
        <tr id="trVariable2" visible="false" runat="server">
            <td><asp:Label runat="server" ID="lblVariable2" Text="Provide Values"></asp:Label></td>
            <td>
            <asp:Label runat="server" ID="lblTimeFormat" Text="Time Format:"></asp:Label>
            <br />
            <asp:TextBox runat="server" Visible="false" ID="txtTimeFormat"></asp:TextBox>
            <br />
            <asp:Label runat="server" ID="lblTimeout" Text="Timeout:"></asp:Label>
            <br />
            <asp:TextBox runat="server" Visible="false" ID="txtTimeout"></asp:TextBox>
            </td>
        </tr>
        <tr id="trUpload" visible="false" runat="server">
            <td>
                Upload File
            </td>
             <td>
               <asp:FileUpload runat="server" ID="fileUploadRecipe" />
            </td>
        </tr>
        <tr id="trUpload2" visible="false" runat="server">
            <td>
                Format
            </td>
            <td>
                <asp:TextBox runat="server" Text="B" ID="txtFormat"></asp:TextBox>
            </td>
        </tr>
        <tr id="trPPID" visible="false" runat="server">
            <td>
               PPID
            </td>
            <td>
                <asp:TextBox runat="server" ID="txtPPID"></asp:TextBox>
            </td>
        </tr>
        <tr id="trCommand" visible="false" runat="server">
            <td>
                Command
                <br />
                <asp:TextBox runat="server" ID="txtCommand"></asp:TextBox>
                <br />
                CPNAME
                <br />
                <asp:TextBox runat="server" ID="txtCPNAME"></asp:TextBox>
                <br />
                CPVAL
                <br />
                <asp:TextBox runat="server" ID="txtCPVAL"></asp:TextBox>
            </td>
        </tr>
        <tr id="trS2F37_ENABLE" runat="server" visible="false">
            <td>
                CEID
                <br />
                <asp:TextBox runat="server" ID="txtCEID_ENABLE"></asp:TextBox>
                <br />
                CEID Format
                <br />
                <asp:TextBox runat="server" Text="U4" ID="txtCEIDFormat_ENABLE"></asp:TextBox>
            </td>
        </tr>
        <tr id="trS2F37_DISABLE" runat="server" visible="false">
            <td>
                CEID
                <br />
                <asp:TextBox runat="server" ID="txtCEID_DISABLE"></asp:TextBox>
                <br />
                 CEID Format
                <br />
                <asp:TextBox runat="server" Text="U4" ID="txtCEIDFormat_DISABLE"></asp:TextBox>
            </td>
        </tr>
        <tr id="trS2F33_DELETE" runat="server" visible="false">
            <td>
                RPTID
                <br />
                <asp:TextBox runat="server" ID="txtRPTID_DELETE"></asp:TextBox>
                <br />
                 DATAID Format
                <br />
                <asp:TextBox runat="server" Text="U4" ID="txtDATAIDFormat_DELETE"></asp:TextBox>
                <br />
                 RPTID Format
                <br />
                <asp:TextBox runat="server" Text="U4" ID="txtRPTIDFormat_DELETE"></asp:TextBox>
            </td>
        </tr>
        <tr id="trS2F33_ADD" runat="server" visible="false">
            <td>
                RPTID
                <br />
                <asp:TextBox runat="server" ID="txtRPTID_ADD"></asp:TextBox>
                <br />
                Variable ID
                <br />
                <asp:TextBox Text="VID" runat="server" ID="txtVARIABLEID_ADD"></asp:TextBox>
                <br />
                Value
                <br />
                <asp:TextBox runat="server" ID="txtID_ADD"></asp:TextBox>
                <br />
                ID Format
                <br />
                <asp:TextBox Text="U4" runat="server" ID="txtIDFormat_ADD"></asp:TextBox>
                <br />
                 DATAID Format
                <br />
                <asp:TextBox runat="server" Text="U4" ID="txtDATAIDFormat_ADD"></asp:TextBox>
                <br />
                 RPTID Format
                <br />
                <asp:TextBox runat="server" Text="U4" ID="txtRPTIDFormat_ADD"></asp:TextBox>
            </td>
        </tr>
        <tr id="trS2F35_UNLINK" runat="server" visible="false">
            <td>
                CEID
                <br />
                <asp:TextBox runat="server" ID="txtCEID_UNLINK"></asp:TextBox>
                <br />
                 DATAID Format
                <br />
                <asp:TextBox runat="server" Text="U4" ID="txtDATAIDFormat_UNLINK"></asp:TextBox>
                <br />
                 CEID Format
                <br />
                <asp:TextBox runat="server" Text="U4" ID="txtCEIDFormat_UNLINK"></asp:TextBox>
            </td>
        </tr>
        <tr id="trS2F35_LINK" runat="server" visible="false">
            <td>
                CEID
                <br />
                <asp:TextBox runat="server" ID="txtCEID_LINK"></asp:TextBox>
                <br />
                 RPTID
                <br />
                <asp:TextBox runat="server" ID="txtRPTID_LINK"></asp:TextBox>
                <br />
                 RPTID Format
                <br />
                <asp:TextBox runat="server" Text="U4" ID="txtRPTIDFormat_LINK"></asp:TextBox>
                <br />
                 DATAID Format
                <br />
                <asp:TextBox runat="server" Text="U4" ID="txtDATAIDFormat_LINK"></asp:TextBox>
                <br />
                 CEID Format
                <br />
                <asp:TextBox runat="server" Text="U4" ID="txtCEIDFormat_LINK"></asp:TextBox>
            </td>
        </tr>
        <tr id="trS7F1" runat="server" visible="false">
            <td>
                File
                <br />
                <asp:FileUpload runat="server" ID="FileUpload_S7F1" />
                <br />
                Length Format
                <br />
                <asp:TextBox runat="server" Text="U4" ID="txtLengthFormat_S7F1"></asp:TextBox>
            </td>
        </tr>
        <tr id="trS7F17" runat="server" visible="false">
            <td>
                PPID
                <br />
                <asp:TextBox runat="server" Text="" ID="txtPPID_S7F17"></asp:TextBox>
            </td>
        </tr>
        <tr>
            <td>Equipment:</td>
            <td><asp:DropDownList runat="server" ID="ddEquipment"></asp:DropDownList></td>
        </tr>
    </table>
        <asp:Button runat="server" ID="btnSend" Text="Send" onclick="btnSend_Click"/>&nbsp;&nbsp;
        <asp:Button runat="server" ID="btnRefresh" Text="Refresh Table" OnClick="btnRefresh_Click"/>
    </div>
    <div>
        <h1>SECS MESSAGES</h1>
        <table>
            <tr>
                <td>
                    <asp:GridView runat="server" ID="gvMessage"></asp:GridView>
                </td>
            </tr>
        </table>
    </div>
    </form>
</body>
</html>
