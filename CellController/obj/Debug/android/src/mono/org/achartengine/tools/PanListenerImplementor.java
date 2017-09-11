package mono.org.achartengine.tools;


public class PanListenerImplementor
	extends java.lang.Object
	implements
		mono.android.IGCUserPeer,
		org.achartengine.tools.PanListener
{
/** @hide */
	public static final String __md_methods;
	static {
		__md_methods = 
			"n_panApplied:()V:GetPanAppliedHandler:AChartEngine.Tools.IPanListenerInvoker, AChartEngine.Bindings.XamarinAndroid\n" +
			"";
		mono.android.Runtime.register ("AChartEngine.Tools.IPanListenerImplementor, AChartEngine.Bindings.XamarinAndroid, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", PanListenerImplementor.class, __md_methods);
	}


	public PanListenerImplementor () throws java.lang.Throwable
	{
		super ();
		if (getClass () == PanListenerImplementor.class)
			mono.android.TypeManager.Activate ("AChartEngine.Tools.IPanListenerImplementor, AChartEngine.Bindings.XamarinAndroid, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null", "", this, new java.lang.Object[] {  });
	}


	public void panApplied ()
	{
		n_panApplied ();
	}

	private native void n_panApplied ();

	private java.util.ArrayList refList;
	public void monodroidAddReference (java.lang.Object obj)
	{
		if (refList == null)
			refList = new java.util.ArrayList ();
		refList.add (obj);
	}

	public void monodroidClearReferences ()
	{
		if (refList != null)
			refList.clear ();
	}
}
