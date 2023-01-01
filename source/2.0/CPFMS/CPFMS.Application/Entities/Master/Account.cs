using CPFMS.Application.Entities.Base;

namespace CPFMS.Application.Entities.Master
{
	public class Account : IdNameBaseEntity
	{
		public string Type { get; set; }
		public bool isSociety { get; set; }
		public Village Village { get; set; }
	}
}
