const serverName = (context, trevor) => {
  if (trevor.hooks[context.command].subdomain)
    if (trevor.hooks[context.command].subdomain === '$sha')
      return context.sha + '.' + trevor.hooks[context.command].domain
    return trevor.hooks[context.command].subdomain + '.' + trevor.hooks[context.command].domain
  return trevor.hooks[context.command].domain
}

export default serverName;
